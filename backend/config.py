import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Application
APP_NAME = "MiniMax UI"
DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"

# Server
SERVER_HOST = os.getenv("SERVER_HOST", "localhost")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8001"))

# MiniMax API
MINIMAX_GROUP_ID = os.getenv("MINIMAX_GROUP_ID")
MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY")
MINIMAX_BASE_URL = "https://api.minimaxi.chat/v1"

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
STATIC_DIR = PROJECT_ROOT / "static"
LOGS_DIR = PROJECT_ROOT / "logs"

# Audio settings
DEFAULT_SAMPLE_RATE = 32000
DEFAULT_FORMAT = "mp3"
DEFAULT_CHANNEL = 1

# Feature flags
ENABLE_CORS = os.getenv("ENABLE_CORS", "true").lower() == "true"


def validate_config():
    """Validate and create required directories."""
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    # Validate required API credentials
    if not MINIMAX_GROUP_ID:
        print("Warning: MINIMAX_GROUP_ID not set in environment")
    if not MINIMAX_API_KEY:
        print("Warning: MINIMAX_API_KEY not set in environment")


validate_config()


# Export config object for easy importing
class Config:
    APP_NAME = APP_NAME
    DEBUG_MODE = DEBUG_MODE
    SERVER_HOST = SERVER_HOST
    SERVER_PORT = SERVER_PORT
    MINIMAX_GROUP_ID = MINIMAX_GROUP_ID
    MINIMAX_API_KEY = MINIMAX_API_KEY
    MINIMAX_BASE_URL = MINIMAX_BASE_URL
    PROJECT_ROOT = PROJECT_ROOT
    STATIC_DIR = STATIC_DIR
    LOGS_DIR = LOGS_DIR
    DEFAULT_SAMPLE_RATE = DEFAULT_SAMPLE_RATE
    DEFAULT_FORMAT = DEFAULT_FORMAT
    DEFAULT_CHANNEL = DEFAULT_CHANNEL
    ENABLE_CORS = ENABLE_CORS


config = Config()
