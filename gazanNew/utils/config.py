

import yaml
import os
from pathlib import Path
import logging

class Config:

    
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config_path = config_path
        self.config_data = {}

        os.makedirs("config", exist_ok=True)

        self._load_config()

        self.logger = self._setup_logger()
        
    def _load_config(self):

        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.config_data = yaml.safe_load(f) or {}
            else:

                self._create_default_config()
                
        except Exception as e:
            print(f"Ошибка загрузки конфигурации: {e}")
            self._create_default_config()
            
    def _create_default_config(self):

        self.config_data = {
            'monitoring': {
                'interval': 5,  # секунды
                'metrics_collection_interval': 2,  # секунды
                'risk_threshold': 0.6  # 0.0 - 1.0
            },
            'logging': {
                'level': 'INFO',
                'file': 'logs/tears_in_rain.log',
                'max_size': '10MB',
                'backup_count': 5
            },
            'audio': {
                'enabled': True,
                'base_frequency': 220,
                'max_volume': 0.7
            },
            'throttling': {
                'enabled': True,
                'max_nice_value': 19,
                'cpu_threshold': 80,
                'memory_threshold': 85
            }
        }
        

        self._save_config()
        
    def _save_config(self):

        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                yaml.dump(self.config_data, f, default_flow_style=False, 
                         allow_unicode=True, indent=2)
        except Exception as e:
            print(f"Ошибка сохранения конфигурации: {e}")
            
    def _setup_logger(self):

        log_config = self.config_data.get('logging', {})
        log_level = getattr(logging, log_config.get('level', 'INFO'))
        

        log_file = log_config.get('file', 'logs/tears_in_rain.log')
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        

        logger = logging.getLogger('TearsInRain')
        logger.setLevel(log_level)
        

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        

        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        

        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        return logger
        
    @property
    def monitoring_interval(self):
        return self.config_data.get('monitoring', {}).get('interval', 5)
        
    @property
    def metrics_collection_interval(self):
        return self.config_data.get('monitoring', {}).get('metrics_collection_interval', 2)
        
    @property
    def risk_threshold(self):
        return self.config_data.get('monitoring', {}).get('risk_threshold', 0.6)
        
    @property
    def log_level(self):
        return self.config_data.get('logging', {}).get('level', 'INFO')
        
    @property
    def audio_enabled(self):
        return self.config_data.get('audio', {}).get('enabled', True)
        
    @property
    def throttling_enabled(self):
        return self.config_data.get('throttling', {}).get('enabled', True)
