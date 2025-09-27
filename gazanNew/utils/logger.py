

import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logger(name: str, level: str = "INFO") -> logging.Logger:

    

    os.makedirs("logs", exist_ok=True)
    

    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))


    logger.handlers.clear()
    

    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    

    file_handler = RotatingFileHandler(
        f"logs/{name.lower()}.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger
