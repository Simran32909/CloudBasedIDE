# server/app/services/git_service.py
import os
import git
import shutil
from flask import current_app
from server.app.services.storage_service import validate_path, ensure_user_path_exists


def git_init(user_id, path):
    """Initialize a new Git repository"""
    absolute_path = validate_path(user_id, path)

    # Ensure the directory exists
    if not os.path.exists(absolute_path):
        os.makedirs(absolute_path, exist_ok=True)

    # Check if it's already a git repository
    if os.path.exists(os.path.join(absolute_path, '.git')):
        return {"message": "Repository already initialized", "path": path}

    # Initialize new repository
    repo = git.Repo.init(absolute_path)

    return {
        "message": "Repository initialized successfully",
        "path": path
    }


def git_clone(user_id, url, path):
    """clone a git repo"""
    user_base_path = ensure_user_path_exists(user_id)
    target_path = os.path.join(user_base_path, path)

    # Validate the destination path is within user's storage area
    absolute_path = validate_path(user_id, path)

    # Check if directory already exists
    if os.path.exists(absolute_path):
        if os.listdir(absolute_path):  # Directory not empty
            raise ValueError(f"Destination path is not empty: {path}")
        # Remove existing directory
        shutil.rmtree(absolute_path)

    # Create parent directory if necessary
    os.makedirs(os.path.dirname(absolute_path), exist_ok=True)

    # Clone repository
    repo = git.Repo.clone_from(url, absolute_path)

    return {
        "message": "Repository cloned successfully",
        "path": path
    }


def git_status(user_id, path):
    """Get the status of a Git repository"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Get basic information
    active_branch = repo.active_branch.name
    is_dirty = repo.is_dirty()

    # Get untracked files
    untracked_files = repo.untracked_files

    # Get modified, added, and deleted files
    modified_files = []
    staged_files = []
    deleted_files = []

    for item in repo.index.diff(None):
        if item.change_type == 'M':
            modified_files.append(item.a_path)
        elif item.change_type == 'D':
            deleted_files.append(item.a_path)

    for item in repo.index.diff('HEAD'):
        staged_files.append(item.a_path)

    return {
        "branch": active_branch,
        "is_dirty": is_dirty,
        "untracked_files": untracked_files,
        "modified_files": modified_files,
        "staged_files": staged_files,
        "deleted_files": deleted_files
    }


def git_add(user_id, path, files):
    """Add files to Git staging area"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Add files
    if files == ['.']:  # Add all files
        repo.git.add('.')
        message = "All files added to staging area"
    else:
        for file in files:
            file_path = os.path.join(absolute_path, file)
            if not os.path.exists(file_path):
                raise ValueError(f"File does not exist: {file}")
            relative_file = os.path.relpath(file_path, absolute_path)
            repo.git.add(relative_file)
        message = f"{len(files)} file(s) added to staging area"

    return {
        "message": message,
        "added_files": files
    }


def git_commit(user_id, path, message):
    """Commit changes to the repository"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Check if there are staged changes
    if not repo.index.diff('HEAD'):
        raise ValueError("No changes staged for commit")

    # Configure author (use user ID as author)
    author = f"user-{user_id} <user-{user_id}@cloud-ide.example.com>"

    # Commit changes
    commit = repo.index.commit(message, author=author, committer=author)

    return {
        "message": "Changes committed successfully",
        "commit_hash": commit.hexsha,
        "commit_message": message
    }


def git_push(user_id, path, branch='main'):
    """Push commits to remote repository"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Check if remote exists
    try:
        origin = repo.remote('origin')
    except ValueError:
        raise ValueError("No remote repository configured")

    # Push to remote
    push_info = origin.push(branch)

    # Check for errors
    for info in push_info:
        if info.flags & info.ERROR:
            raise ValueError(f"Push failed: {info.summary}")

    return {
        "message": "Changes pushed to remote repository",
        "branch": branch
    }


def git_pull(user_id, path, branch='main'):
    """Pull changes from remote repository"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Check if remote exists
    try:
        origin = repo.remote('origin')
    except ValueError:
        raise ValueError("No remote repository configured")

    # Pull from remote
    pull_info = origin.pull(branch)

    return {
        "message": "Changes pulled from remote repository",
        "branch": branch
    }


def git_branch(user_id, path):
    """List branches in the repository"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Get local branches
    local_branches = [str(branch) for branch in repo.heads]

    # Get active branch
    active_branch = str(repo.active_branch)

    return {
        "active_branch": active_branch,
        "local_branches": local_branches
    }


def git_checkout(user_id, path, branch, create=False):
    """Checkout a branch"""
    absolute_path = validate_path(user_id, path)

    # Check if it's a git repository
    if not os.path.exists(os.path.join(absolute_path, '.git')):
        raise ValueError(f"Not a git repository: {path}")

    repo = git.Repo(absolute_path)

    # Check if the branch exists
    if branch in [str(b) for b in repo.heads]:
        # Checkout existing branch
        repo.git.checkout(branch)
        message = f"Switched to branch '{branch}'"
    elif create:
        # Create and checkout new branch
        repo.git.checkout('-b', branch)
        message = f"Created and switched to branch '{branch}'"
    else:
        raise ValueError(f"Branch '{branch}' does not exist")

    return {
        "message": message,
        "branch": branch
    }