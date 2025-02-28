# server/app/services/auth_service.py
from app.models.user import User, db
import re


def validate_email(email):
    """Validate email format"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """
    Validate password strength
    - At least 8 characters
    - Contains uppercase and lowercase letters
    - Contains at least one digit
    """
    if len(password) < 8:
        return False
    if not any(c.isupper() for c in password):
        return False
    if not any(c.islower() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    return True


def register_user(username, email, password):
    """Register a new user"""

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        raise ValueError(f"Username '{username}' is already taken")

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        raise ValueError(f"Email '{email}' is already registered")

    # Validate email format
    if not validate_email(email):
        raise ValueError("Invalid email format")

    # Validate password strength
    if not validate_password(password):
        raise ValueError("Password must be at least 8 characters long and contain uppercase, lowercase, and digits")

    # Create new user
    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return user


def authenticate_user(email, password):
    """Authenticate a user with email and password"""
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        return user

    return None