# server/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from server.app.models.user import db
from server.app.middleware.error import register_error_handlers


def create_app(config_object="server.app.config.Config"):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_object)

    # Initialize extensions
    CORS(app)
    jwt = JWTManager(app)
    db.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Create all database tables
    with app.app_context():
        db.create_all()

    # Register blueprints
    from server.app.api.auth import auth_bp
    from server.app.api.files import files_bp
    from server.app.api.execution import execution_bp
    from server.app.api.git import git_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(execution_bp, url_prefix='/api/execution')
    app.register_blueprint(git_bp, url_prefix='/api/git')

    # Add project routes if needed
    from server.app.api.projects import projects_bp
    app.register_blueprint(projects_bp, url_prefix='/api/projects')

    # Root route
    @app.route('/')
    def home():
        return {'message': 'Welcome to Cloud IDE API'}

    return app