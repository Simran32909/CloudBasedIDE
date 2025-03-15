# server/app/api/files.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.storage_service import (
    list_files,
    create_file,
    read_file,
    update_file,
    delete_file,
    create_directory,
    delete_directory,
    ensure_user_path_exists
)
import logging

logger = logging.getLogger(__name__)
files_bp = Blueprint('files', __name__)

@files_bp.route('/list', methods=['GET'])
@jwt_required()
def get_files():
    """List files in a directory"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Listing files for user {user_id}")
        path = request.args.get('path', '')
        
        # Ensure user's storage exists
        ensure_user_path_exists(user_id)
        
        result = list_files(user_id, path)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Value error in get_files: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in get_files: {str(e)}")
        return jsonify({'error': 'Failed to list files', 'message': str(e)}), 500

@files_bp.route('/file', methods=['POST'])
@jwt_required()
def create_new_file():
    """Create a new file"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Creating file for user {user_id}")
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        if 'name' not in data:
            return jsonify({'error': 'File name is required'}), 400
        
        directory = data.get('path', '')
        name = data['name']
        content = data.get('content', '')
        
        result = create_file(user_id, directory, name, content)
        return jsonify(result), 201
    except ValueError as e:
        logger.error(f"Value error in create_new_file: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in create_new_file: {str(e)}")
        return jsonify({'error': 'Failed to create file', 'message': str(e)}), 500

@files_bp.route('/file', methods=['PUT'])
@jwt_required()
def update_existing_file():
    """Update an existing file"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Updating file for user {user_id}")
        data = request.get_json()
        
        if not data or 'path' not in data or 'content' not in data:
            return jsonify({'error': 'File path and content are required'}), 400
        
        result = update_file(user_id, data['path'], data['content'])
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Value error in update_existing_file: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except FileNotFoundError as e:
        logger.error(f"File not found in update_existing_file: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error(f"Error in update_existing_file: {str(e)}")
        return jsonify({'error': 'Failed to update file', 'message': str(e)}), 500

@files_bp.route('/file', methods=['GET'])
@jwt_required()
def get_file_content():
    """Get file content"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Getting file content for user {user_id}")
        path = request.args.get('path')
        
        if not path:
            return jsonify({'error': 'File path is required'}), 400
        
        result = read_file(user_id, path)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Value error in get_file_content: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except FileNotFoundError as e:
        logger.error(f"File not found in get_file_content: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error(f"Error in get_file_content: {str(e)}")
        return jsonify({'error': 'Failed to read file', 'message': str(e)}), 500

@files_bp.route('/file', methods=['DELETE'])
@jwt_required()
def delete_existing_file():
    """Delete a file"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Deleting file for user {user_id}")
        path = request.args.get('path')
        
        if not path:
            return jsonify({'error': 'File path is required'}), 400
        
        result = delete_file(user_id, path)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Value error in delete_existing_file: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except FileNotFoundError as e:
        logger.error(f"File not found in delete_existing_file: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error(f"Error in delete_existing_file: {str(e)}")
        return jsonify({'error': 'Failed to delete file', 'message': str(e)}), 500

@files_bp.route('/directory', methods=['POST'])
@jwt_required()
def create_new_directory():
    """Create a new directory"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Creating directory for user {user_id}")
        data = request.get_json()
        
        if not data or 'name' not in data:
            return jsonify({'error': 'Directory name is required'}), 400
        
        parent_path = data.get('path', '')
        name = data['name']
        
        result = create_directory(user_id, parent_path, name)
        return jsonify(result), 201
    except ValueError as e:
        logger.error(f"Value error in create_new_directory: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in create_new_directory: {str(e)}")
        return jsonify({'error': 'Failed to create directory', 'message': str(e)}), 500

@files_bp.route('/directory', methods=['DELETE'])
@jwt_required()
def delete_existing_directory():
    """Delete a directory"""
    try:
        user_id = get_jwt_identity()
        logger.debug(f"Deleting directory for user {user_id}")
        path = request.args.get('path')
        
        if not path:
            return jsonify({'error': 'Directory path is required'}), 400
        
        result = delete_directory(user_id, path)
        return jsonify(result), 200
    except ValueError as e:
        logger.error(f"Value error in delete_existing_directory: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except FileNotFoundError as e:
        logger.error(f"Directory not found in delete_existing_directory: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error(f"Error in delete_existing_directory: {str(e)}")
        return jsonify({'error': 'Failed to delete directory', 'message': str(e)}), 500