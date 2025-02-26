# server/app/api/projects.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app.models.project import Project
from server.app.models.user import db
from server.app.services.storage_service import (
    create_directory,
    ensure_user_path_exists
)

projects_bp = Blueprint('projects', __name__)


@projects_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects for the current user"""
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(user_id=user_id).all()

    return jsonify([project.to_dict() for project in projects]), 200


@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    """Get a specific project by ID"""
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    return jsonify(project.to_dict()), 200


@projects_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project"""
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate required fields
    if 'name' not in data:
        return jsonify({'error': 'Project name is required'}), 400

    # Generate path for the project
    path = Project.generate_path(user_id, data['name'])

    # Create project in database
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        path=path,
        is_public=data.get('is_public', False),
        user_id=user_id
    )

    db.session.add(project)
    db.session.commit()

    # Create project directory
    try:
        ensure_user_path_exists(user_id)
        create_directory(user_id, '', path)
    except Exception as e:
        # Rollback if directory creation fails
        db.session.delete(project)
        db.session.commit()
        return jsonify({'error': f'Failed to create project directory: {str(e)}'}), 500

    return jsonify(project.to_dict()), 201


@projects_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Update an existing project"""
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        project.name = data['name']
    if 'description' in data:
        project.description = data['description']
    if 'is_public' in data:
        project.is_public = data['is_public']

    db.session.commit()

    return jsonify(project.to_dict()), 200


@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a project"""
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    # Delete project directory (this will recursively delete all files)
    try:
        from server.app.services.storage_service import delete_directory
        delete_directory(user_id, project.path)
    except Exception as e:
        return jsonify({'error': f'Failed to delete project directory: {str(e)}'}), 500

    # Delete project from database
    db.session.delete(project)
    db.session.commit()

    return jsonify({'message': 'Project deleted successfully'}), 200