# server/app/utils/__init__.py
"""
Utilities package for Cloud IDE
Contains helper functions and shared utilities
"""

import os
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


# Configure logging
def setup_logging(app):
    """Set up logging for the application"""
    log_level = app.config.get('LOG_LEVEL', 'INFO')

    # Set up basic configuration
    logging.basicConfig(
        level=getattr(logging, log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Add file handler if log directory is specified
    log_dir = app.config.get('LOG_DIR')
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)
        file_handler = logging.FileHandler(
            os.path.join(log_dir, f'cloud_ide_{datetime.now().strftime("%Y%m%d")}.log')
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        ))
        root_logger = logging.getLogger()
        root_logger.addHandler(file_handler)

    return logger


# JSON encoder with datetime support
class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles datetime objects"""

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)