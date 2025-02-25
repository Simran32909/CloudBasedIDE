# server/app/api/files.py
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app.services.storage_service import (
    create_file,
    update_file,
    delete_file,
    read_file,
    list_files,
    create_directory,
    delete_directory
)

import os

files_bp = Blueprint('files', __name__)

@files_bp.route('/list', methods=['GET'])
@jwt_required()
def get_files():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    try:
        file_list = list_files(user_id, path)
        return jsonify(file_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/file', methods=['POST'])
@jwt_required()
def create_new_file():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'name' not in data:
        return jsonify({'error': 'Path and name are required'}), 400

    content = data.get('content', '')

    try:
        file_path = create_file(user_id, data['path'], data['name'], content)
        return jsonify({'path': file_path}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/file', methods=['PUT'])
@jwt_required()
def update_existing_file():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'content' not in data:
        return jsonify({'error': 'Path and content are required'}), 400

    try:
        update_file(user_id, data['path'], data['content'])
        return jsonify({'message': 'File updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/file', methods=['GET'])
@jwt_required()
def get_file_content():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    if not path:
        return jsonify({'error': 'Path is required'}), 400

    try:
        content = read_file(user_id, path)
        return jsonify({'content': content}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/file', methods=['DELETE'])
@jwt_required()
def delete_existing_file():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    if not path:
        return jsonify({'error': 'Path is required'}), 400

    try:
        delete_file(user_id, path)
        return jsonify({'message': 'File deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/directory', methods=['POST'])
@jwt_required()
def create_new_directory():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'name' not in data:
        return jsonify({'error': 'Path and name are required'}), 400

    try:
        dir_path = create_directory(user_id, data['path'], data['name'])
        return jsonify({'path': dir_path}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@files_bp.route('/directory', methods=['DELETE'])
@jwt_required()
def delete_existing_directory():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    if not path:
        return jsonify({'error': 'Path is required'}), 400

    try:
        delete_directory(user_id, path)
        return jsonify({'message': 'Directory deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400