# server/app/services/storage_service.py
import os
import shutil
from pathlib import Path
from flask import current_app
import logging
from app.models.user import User

logger = logging.getLogger(__name__)

def get_user_storage_path(user_id):
    """Get the absolute path to a user's storage directory"""
    base_path = current_app.config.get('STORAGE_PATH', 'storage')
    return os.path.join(base_path, str(user_id))

def ensure_user_path_exists(user_id):
    """Ensure the user's storage directory exists"""
    user_path = get_user_storage_path(user_id)
    os.makedirs(user_path, exist_ok=True)
    return user_path

def validate_path(user_id, path):
    """Validate that a path is within the user's storage directory"""
    user_path = get_user_storage_path(user_id)
    full_path = os.path.normpath(os.path.join(user_path, path))
    
    if not full_path.startswith(os.path.normpath(user_path)):
        raise ValueError("Invalid path: Access denied")
    
    return full_path

def list_files(user_id, path=""):
    """List files in a directory"""
    try:
        user_path = ensure_user_path_exists(user_id)
        target_path = os.path.join(user_path, path) if path else user_path
        
        if not os.path.exists(target_path):
            return {"files": [], "directories": []}

        files = []
        directories = []

        for item in os.listdir(target_path):
            item_path = os.path.join(path, item) if path else item
            full_path = os.path.join(target_path, item)
            
            if os.path.isfile(full_path):
                files.append({
                    "name": item,
                    "path": item_path,
                    "type": "file"
                })
            elif os.path.isdir(full_path):
                directories.append({
                    "name": item,
                    "path": item_path,
                    "type": "directory"
                })

        return {
            "files": sorted(files, key=lambda x: x["name"]),
            "directories": sorted(directories, key=lambda x: x["name"])
        }
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise

def create_file(user_id, directory, name, content=""):
    """Create a new file"""
    try:
        user_path = ensure_user_path_exists(user_id)
        
        # Combine directory and name to get full path
        relative_path = os.path.join(directory, name) if directory else name
        full_path = validate_path(user_id, relative_path)
        
        # Create parent directories if they don't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write the file
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return {"message": "File created successfully", "path": relative_path}
    except Exception as e:
        logger.error(f"Error creating file: {str(e)}")
        raise

def read_file(user_id, path):
    """Read file content"""
    try:
        full_path = validate_path(user_id, path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {path}")
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return {"content": content, "path": path}
    except Exception as e:
        logger.error(f"Error reading file: {str(e)}")
        raise

def update_file(user_id, path, content):
    """Update file content"""
    try:
        full_path = validate_path(user_id, path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {path}")
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return {"message": "File updated successfully", "path": path}
    except Exception as e:
        logger.error(f"Error updating file: {str(e)}")
        raise

def delete_file(user_id, path):
    """Delete a file"""
    try:
        full_path = validate_path(user_id, path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {path}")
        
        os.remove(full_path)
        return {"message": "File deleted successfully", "path": path}
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise

def create_directory(user_id, parent_path, name):
    """Create a new directory"""
    try:
        # Combine parent path and name to get full path
        relative_path = os.path.join(parent_path, name) if parent_path else name
        full_path = validate_path(user_id, relative_path)
        
        os.makedirs(full_path, exist_ok=True)
        return {"message": "Directory created successfully", "path": relative_path}
    except Exception as e:
        logger.error(f"Error creating directory: {str(e)}")
        raise

def delete_directory(user_id, path):
    """Delete a directory and all its contents"""
    try:
        full_path = validate_path(user_id, path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Directory not found: {path}")
        
        shutil.rmtree(full_path)
        return {"message": "Directory deleted successfully", "path": path}
    except Exception as e:
        logger.error(f"Error deleting directory: {str(e)}")
        raise