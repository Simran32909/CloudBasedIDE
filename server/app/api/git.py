# server/app/api/git.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.git_service import (
    git_init,
    git_clone,
    git_status,
    git_add,
    git_commit,
    git_push,
    git_pull,
    git_branch,
    git_checkout
)

git_bp = Blueprint('git', __name__)


@git_bp.route('/init', methods=['POST'])
@jwt_required()
def initialize_repo():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data:
        return jsonify({'error': 'Path is required'}), 400

    try:
        result = git_init(user_id, data['path'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/clone', methods=['POST'])
@jwt_required()
def clone_repo():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'url' not in data or 'path' not in data:
        return jsonify({'error': 'URL and path are required'}), 400

    try:
        result = git_clone(user_id, data['url'], data['path'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/status', methods=['GET'])
@jwt_required()
def get_status():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    if not path:
        return jsonify({'error': 'Path is required'}), 400

    try:
        result = git_status(user_id, path)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/add', methods=['POST'])
@jwt_required()
def add_files():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'files' not in data:
        return jsonify({'error': 'Path and files are required'}), 400

    try:
        result = git_add(user_id, data['path'], data['files'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/commit', methods=['POST'])
@jwt_required()
def commit_changes():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'message' not in data:
        return jsonify({'error': 'Path and message are required'}), 400

    try:
        result = git_commit(user_id, data['path'], data['message'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/push', methods=['POST'])
@jwt_required()
def push_changes():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data:
        return jsonify({'error': 'Path is required'}), 400

    branch = data.get('branch', 'main')

    try:
        result = git_push(user_id, data['path'], branch)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/pull', methods=['POST'])
@jwt_required()
def pull_changes():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data:
        return jsonify({'error': 'Path is required'}), 400

    branch = data.get('branch', 'main')

    try:
        result = git_pull(user_id, data['path'], branch)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/branch', methods=['GET'])
@jwt_required()
def list_branches():
    user_id = get_jwt_identity()
    path = request.args.get('path', '')

    if not path:
        return jsonify({'error': 'Path is required'}), 400

    try:
        result = git_branch(user_id, path)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@git_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout_branch():
    user_id = get_jwt_identity()
    data = request.get_json()

    if 'path' not in data or 'branch' not in data:
        return jsonify({'error': 'Path and branch are required'}), 400

    create = data.get('create', False)

    try:
        result = git_checkout(user_id, data['path'], data['branch'], create)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400