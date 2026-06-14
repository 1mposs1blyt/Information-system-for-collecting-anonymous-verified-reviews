import os
import sys
from loguru import logger

os.makedirs("logs", exist_ok=True)

logger.remove()

LOG_FORMAT = "[{time:YYYY-MM-DD HH:mm:ss}] [{level}] [{file}:{line}] - {message}"

logger.add(sys.stdout, format=LOG_FORMAT, level="INFO")

logger.add(
    "logs/app.log",
    format=LOG_FORMAT,
    level="INFO",
    rotation="10 MB",
    retention=5,
    compression="zip"
)
