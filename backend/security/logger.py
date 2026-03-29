import logging
import os

# Create auth logs directory if not exists
log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
os.makedirs(log_dir, exist_ok=True)

# Configure the logger
auth_logger = logging.getLogger("auth_audit")
auth_logger.setLevel(logging.WARNING)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# File handler
file_handler = logging.FileHandler(os.path.join(log_dir, 'auth_audit.log'))
file_handler.setFormatter(formatter)
auth_logger.addHandler(file_handler)

def log_failed_attempt(username: str, ip_address: str):
    auth_logger.warning(f"Failed login attempt for user: {username} from IP: {ip_address}")

def log_unauthorized_access(endpoint: str, ip_address: str):
    auth_logger.warning(f"Unauthorized access attempt to {endpoint} from IP: {ip_address}")
