# server/app/services/storage_service.py
import os
from pathlib import Path
import shutil
from flask import current_app
from server.app.models.user import User


def get_user_storage_path(user_id):
    """Get the base storage path for a user"""
    storage_base = current_app.config['STORAGE_PATH']
    return os.path.join(storage_base, str(user_id))


def ensure_user_path_exists(user_id):
    """Ensure the user's storage directory exists"""
    user_path = get_user_storage_path(user_id)
    os.makedirs(user_path, exist_ok=True)
    return user_path


def validate_path(user_id, path):
    """Validate that a path is within the user's storage area"""
    user_base_path = get_user_storage_path(user_id)
    absolute_path = os.path.abspath(os.path.join(user_base_path, path))

    # Check if the path is within the user's storage area
    if not absolute_path.startswith(user_base_path):
        raise ValueError("Invalid path: outside of user storage area")

    return absolute_path


def list_files(user_id, path=""):
    """List files and directories at the specified path"""
    absolute_path = validate_path(user_id, path)

    # Ensure the directory exists
    if not os.path.exists(absolute_path):
        raise ValueError(f"Path does not exist: {path}")

    if not os.path.isdir(absolute_path):
        raise ValueError(f"Path is not a directory: {path}")

    result = []

    for item in os.listdir(absolute_path):
        item_path = os.path.join(absolute_path, item)
        is_dir = os.path.isdir(item_path)

        # Calculate relative path from user storage root
        user_base_path = get_user_storage_path(user_id)
        relative_path = os.path.relpath(item_path, user_base_path)

        result.append({
            'name': item,
            'path': relative_path.replace('\\', '/'),  # Normalize path separators
            'type': 'directory' if is_dir else 'file',
            'size': 0 if is_dir else os.path.getsize(item_path),
            'modified': os.path.getmtime(item_path)
        })

    # Sort directories first, then files, alphabetically
    result.sort(key=lambda x: (0 if x['type'] == 'directory' else 1, x['name'].lower()))

    return result


def create_file(user_id, directory, name, content=""):
    """Create a new file with the given content"""
    # Validate the directory path
    dir_absolute_path = validate_path(user_id, directory)

    # Ensure the directory exists
    if not os.path.exists(dir_absolute_path):
        os.makedirs(dir_absolute_path, exist_ok=True)

    # Construct the file path
    file_relative_path = os.path.join(directory, name)
    file_absolute_path = os.path.join(dir_absolute_path, name)

    # Check if file already exists
    if os.path.exists(file_absolute_path):
        raise ValueError(f"File already exists: {file_relative_path}")

    # Write content to the file
    with open(file_absolute_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return file_relative_path.replace('\\', '/')


def update_file(user_id, path, content):
    """Update an existing file with new content"""
    absolute_path = validate_path(user_id, path)

    # Check if file exists
    if not os.path.exists(absolute_path):
        raise ValueError(f"File does not exist: {path}")

    # Check if it's actually a file
    if not os.path.isfile(absolute_path):
        raise ValueError(f"Path is not a file: {path}")

    # Write content to the file
    with open(absolute_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def read_file(user_id, path):
    """Read the content of a file"""
    absolute_path = validate_path(user_id, path)

    # Check if file exists
    if not os.path.exists(absolute_path):
        raise ValueError(f"File does not exist: {path}")

    # Check if it's actually a file
    if not os.path.isfile(absolute_path):
        raise ValueError(f"Path is not a file: {path}")

    # Read content from the file
    with open(absolute_path, 'r', encoding='utf-8') as f:
        content = f.read()

    return content


def delete_file(user_id, path):
    """Delete a file"""
    absolute_path = validate_path(user_id, path)

    # Check if file exists
    if not os.path.exists(absolute_path):
        raise ValueError(f"File does not exist: {path}")

    # Check if it's actually a file
    if not os.path.isfile(absolute_path):
        raise ValueError(f"Path is not a file: {path}")

    # Delete the file
    os.remove(absolute_path)

    return True


def create_directory(user_id, parent_path, name):
    """Create a new directory"""
    # Validate the parent path
    parent_absolute_path = validate_path(user_id, parent_path)

    # Ensure the parent directory exists
    if not os.path.exists(parent_absolute_path):
        os.makedirs(parent_absolute_path, exist_ok=True)

    # Construct the directory path
    dir_relative_path = os.path.join(parent_path, name)
    dir_absolute_path = os.path.join(parent_absolute_path, name)

    # Check if directory already exists
    if os.path.exists(dir_absolute_path):
        raise ValueError(f"Directory already exists: {dir_relative_path}")

    # Create the directory
    os.makedirs(dir_absolute_path)

    return dir_relative_path.replace('\\', '/')


def delete_directory(user_id, path):
    """Delete a directory and all its contents"""
    absolute_path = validate_path(user_id, path)

    # Check if directory exists
    if not os.path.exists(absolute_path):
        raise ValueError(f"Directory does not exist: {path}")

    # Check if it's actually a directory
    if not os.path.isdir(absolute_path):
        raise ValueError(f"Path is not a directory: {path}")

    # Delete the directory and all its contents
    shutil.rmtree(absolute_path)

    return True