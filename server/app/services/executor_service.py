# server/app/services/executor_service.py
import os
import subprocess
import tempfile
import uuid
import docker
from flask import current_app
import time
import json


def execute_code(user_id, language, code, input_data=""):
    """
    Execute code in a specified language
    Returns execution result including stdout, stderr, and execution time
    """
    if language not in get_supported_languages():
        raise ValueError(f"Unsupported language: {language}")

    # Create a unique execution ID
    execution_id = str(uuid.uuid4())

    # Choose execution method based on language
    if language == "python":
        return _execute_python(execution_id, code, input_data)
    elif language == "javascript":
        return _execute_javascript(execution_id, code, input_data)
    elif language == "java":
        return _execute_java(execution_id, code, input_data)
    else:
        raise ValueError(f"Language {language} is supported but not implemented")


def get_supported_languages():
    """Get a list of supported language IDs"""
    return ["python", "javascript", "java"]


def _execute_python(execution_id, code, input_data):
    """Execute Python code in a Docker container"""
    return _execute_in_container("python:3.9-slim", execution_id,
                                 "python", "main.py", code, input_data)


def _execute_javascript(execution_id, code, input_data):
    """Execute JavaScript code in a Docker container"""
    return _execute_in_container("node:16-slim", execution_id,
                                 "node", "main.js", code, input_data)


def _execute_java(execution_id, code, input_data):
    """Execute Java code in a Docker container"""
    # Java needs special handling for class name
    main_class_name = _extract_java_class_name(code)
    if not main_class_name:
        main_class_name = "Main"  # Default class name
        # Wrap code in a Main class if no public class is defined
        if "public class" not in code:
            code = f"public class {main_class_name} {{\n{code}\n}}"

    result = _execute_in_container("openjdk:11-slim", execution_id,
                                   "bash", "-c",
                                   f"javac {main_class_name}.java && java {main_class_name}",
                                   code, input_data, file_name=f"{main_class_name}.java")
    return result


def _extract_java_class_name(code):
    """Extract the main class name from Java code"""
    import re
    match = re.search(r'public\s+class\s+(\w+)', code)
    if match:
        return match.group(1)
    return None


def _execute_in_container(image, execution_id, command, file_arg, code, input_data, file_name=None):
    """Execute code in a Docker container with the specified image"""
    client = docker.from_env()

    # Create a temporary directory for code and input files
    with tempfile.TemporaryDirectory() as temp_dir:
        # Write code to file
        code_file = file_name or f"main.{_get_file_extension(file_arg)}"
        code_path = os.path.join(temp_dir, code_file)
        with open(code_path, 'w') as f:
            f.write(code)

        # Write input to file if provided
        input_path = os.path.join(temp_dir, 'input.txt')
        with open(input_path, 'w') as f:
            f.write(input_data)

        # Setup container with mounted volume and limited resources
        start_time = time.time()
        try:
            container = client.containers.run(
                image=image,
                command=f"{command} {file_arg} < /code/input.txt",
                volumes={temp_dir: {'bind': '/code', 'mode': 'rw'}},
                working_dir="/code",
                mem_limit="128m",
                memswap_limit="256m",
                cpus=0.5,
                detach=True,
                network_disabled=True
            )

            # Wait for container to finish with timeout
            timeout = current_app.config.get('EXECUTION_TIMEOUT', 30)
            container.wait(timeout=timeout)

            # Get container logs
            stdout = container.logs(stdout=True, stderr=False).decode('utf-8')
            stderr = container.logs(stdout=False, stderr=True).decode('utf-8')

            # Clean up
            container.remove(force=True)

        except docker.errors.ContainerError as e:
            stdout = ""
            stderr = str(e)
        except docker.errors.APIError as e:
            stdout = ""
            stderr = f"Docker API error: {str(e)}"
        except Exception as e:
            stdout = ""
            stderr = f"Execution error: {str(e)}"

        execution_time = time.time() - start_time

        return {
            "execution_id": execution_id,
            "language": _get_language_from_image(image),
            "stdout": stdout,
            "stderr": stderr,
            "execution_time": round(execution_time, 3)
        }


def _get_file_extension(file_arg):
    """Get file extension based on the command"""
    if file_arg.endswith(".py"):
        return "py"
    elif file_arg.endswith(".js"):
        return "js"
    elif file_arg.endswith(".java"):
        return "java"
    return "txt"


def _get_language_from_image(image):
    """Get language name from Docker image"""
    if "python" in image:
        return "python"
    elif "node" in image:
        return "javascript"
    elif "openjdk" in image:
        return "java"
    return "unknown"