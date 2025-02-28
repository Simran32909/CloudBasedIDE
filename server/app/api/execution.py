# server/app/api/execution.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.executor_service import execute_code

execution_bp = Blueprint('execution', __name__)


@execution_bp.route('/run', methods=['POST'])
@jwt_required()
def run_code():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate required fields
    if 'language' not in data or 'code' not in data:
        return jsonify({'error': 'Language and code are required'}), 400

    language = data['language']
    code = data['code']
    input_data = data.get('input', '')

    try:
        result = execute_code(user_id, language, code, input_data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@execution_bp.route('/languages', methods=['GET'])
def list_languages():
    """Get a list of supported languages for code execution"""
    supported_languages = [
        {'id': 'python', 'name': 'Python', 'version': '3.9'},
        {'id': 'javascript', 'name': 'JavaScript', 'version': 'Node.js 16'},
        {'id': 'java', 'name': 'Java', 'version': '11'}
        # Add more supported languages as they become available
    ]

    return jsonify(supported_languages), 200