import os
from pathlib import Path

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "default_development_secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN = 60 * 24 * 7  # 7 days in minutes

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cloudide.db")

# File Storage Configuration
PROJECT_ROOT = Path(__file__).parent
USER_CODE_DIR = os.getenv("USER_CODE_DIR", str(PROJECT_ROOT / "user_code"))

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://simran32909.github.io"
]