from flask import current_app
import logging

logger = logging.getLogger(__name__)


def init_services(app):
    """Initialize all services required by the application"""

    # Ensure storage directory exists
    import os
    storage_path = app.config.get('STORAGE_PATH')
    if storage_path and not os.path.exists(storage_path):
        os.makedirs(storage_path, exist_ok=True)
        logger.info(f"Created storage directory at {storage_path}")

    # Validate Docker availability if code execution is enabled
    try:
        import docker
        client = docker.from_env()
        client.ping()
        logger.info("Docker service available")
    except Exception as e:
        logger.warning(f"Docker service unavailable, code execution may not work: {str(e)}")

    # Initialize git configuration
    if app.config.get('GIT_ENABLED', True):
        try:
            import git
            # Set global git config for the application
            git_config = git.GitConfigParser([])
            git_config.set_value("user", "name", "Cloud IDE Service")
            git_config.set_value("user", "email", "service@cloud-ide.example.com")
            logger.info("Git service initialized")
        except Exception as e:
            logger.warning(f"Git initialization failed: {str(e)}")