# server/app/utils/file_helpers.py
import os
import mimetypes
import re


def get_file_type(file_path):
    """
    Determine the file type based on extension
    Returns a dictionary with type and language information
    """
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()

    # Initialize mime type
    mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'

    # Default file type info
    file_info = {
        'type': 'text',
        'mime': mime_type,
        'language': None,
        'binary': False
    }

    # Map extensions to languages for syntax highlighting
    language_map = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.json': 'json',
        '.md': 'markdown',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'c',
        '.php': 'php',
        '.rb': 'ruby',
        '.sh': 'shell',
        '.bash': 'shell',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.xml': 'xml',
        '.sql': 'sql',
        '.go': 'go',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.vue': 'vue'
    }

    # Set language based on file extension
    if ext in language_map:
        file_info['language'] = language_map[ext]

    # Determine if binary file
    binary_extensions = [
        '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp',
        '.pdf', '.zip', '.tar', '.gz', '.rar', '.7z', '.exe', '.dll',
        '.so', '.dylib', '.class', '.pyc', '.jar', '.war', '.ear',
        '.mp3', '.mp4', '.avi', '.mov', '.flv', '.wmv', '.wav'
    ]

    if ext in binary_extensions:
        file_info['type'] = 'binary'
        file_info['binary'] = True

    return file_info


def is_valid_filename(filename):
    """Validate that a filename is safe and contains no dangerous characters"""
    # No empty filenames
    if not filename or filename.strip() == '':
        return False

    # No paths within the filename
    if '/' in filename or '\\' in filename:
        return False

    # No starting with dots (hidden files)
    if filename.startswith('.'):
        return False

    # Check for valid filename pattern (alphanumeric, dash, underscore, period)
    pattern = r'^[a-zA-Z0-9_\-. ]+$'
    return bool(re.match(pattern, filename))


def sanitize_path(path):
    """Sanitize a path to prevent path traversal attacks"""
    # Remove redundant separators
    path = re.sub(r'/+', '/', path)

    # Remove leading and trailing slashes
    path = path.strip('/')

    # Split path into components
    components = path.split('/')

    # Filter out dangerous components
    safe_components = []
    for component in components:
        # Skip empty components, current directory references, and parent directory references
        if component in ('', '.', '..'):
            continue
        safe_components.append(component)

    # Rebuild the path
    return '/'.join(safe_components)