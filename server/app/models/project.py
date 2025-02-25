# server/app/models/project.py
from .user import db
from datetime import datetime
import uuid


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    path = db.Column(db.String(255), unique=True, nullable=False)
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    @staticmethod
    def generate_path(user_id, name):
        """Generate a unique path for the project"""
        safe_name = name.lower().replace(' ', '-')
        unique_id = str(uuid.uuid4())[:8]
        return f"projects/{user_id}/{safe_name}-{unique_id}"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'path': self.path,
            'is_public': self.is_public,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }