

import asyncio
import numpy as np
import psutil
import time
from dataclasses import dataclass
from typing import List, Dict, Optional
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

@dataclass
class SystemMetrics:

    timestamp: float
    cpu_percent: float
    memory_percent: float
    disk_io_read: float
    disk_io_write: float
    network_io_sent: float
    network_io_recv: float
    load_avg: List[float]
    process_count: int

@dataclass
class Prediction:

    risk_level: float  # 0.0 - 1.0
    description: str
    affected_resources: List[str]
    recommended_actions: List[str]
    confidence: float

class BattyAgent:

    
    def __init__(self, config):
        self.config = config
        self.logger = config.logger
        self.model = None
        self.scaler = StandardScaler()
        self.metrics_history = []
        self.model_path = "models/batty_model.joblib"
        self.scaler_path = "models/batty_scaler.joblib"
        
        # Создание директории для моделей
        os.makedirs("models", exist_ok=True)
        
        self.running = False
        
    async def start(self):

        self.logger.info("🤖 Запуск агента Батти...")
        

        await self._load_or_create_model()
        
        self.running = True
        

        asyncio.create_task(self._training_loop())
        
    async def stop(self):

        self.running = False
        await self._save_model()
        
    async def _load_or_create_model(self):

        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.logger.info("📚 Модель загружена из файла")
            else:
                self.model = IsolationForest(
                    contamination=0.1,
                    random_state=42,
                    n_estimators=100
                )
                self.logger.info("🆕 Создана новая модель")
        except Exception as e:
            self.logger.error(f"Ошибка загрузки модели: {e}")
            self.model = IsolationForest(contamination=0.1, random_state=42)
            
    async def _save_model(self):

        try:
            if self.model and len(self.metrics_history) > 10:
                joblib.dump(self.model, self.model_path)
                joblib.dump(self.scaler, self.scaler_path)
                self.logger.info("💾 Модель сохранена")
        except Exception as e:
            self.logger.error(f"Ошибка сохранения модели: {e}")
            
    async def _collect_metrics(self) -> SystemMetrics:

        try:
            # CPU и память
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # Дисковый I/O
            disk_io = psutil.disk_io_counters()
            disk_io_read = disk_io.read_bytes if disk_io else 0
            disk_io_write = disk_io.write_bytes if disk_io else 0
            
            # Сетевой I/O
            net_io = psutil.net_io_counters()
            net_io_sent = net_io.bytes_sent if net_io else 0
            net_io_recv = net_io.bytes_recv if net_io else 0
            
            # Загрузка системы
            load_avg = list(psutil.getloadavg())
            
            # Количество процессов
            process_count = len(psutil.pids())
            
            return SystemMetrics(
                timestamp=time.time(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                disk_io_read=disk_io_read,
                disk_io_write=disk_io_write,
                network_io_sent=net_io_sent,
                network_io_recv=net_io_recv,
                load_avg=load_avg,
                process_count=process_count
            )
        except Exception as e:
            self.logger.error(f"Ошибка сбора метрик: {e}")
            return None
            
    def _metrics_to_features(self, metrics: SystemMetrics) -> np.array:

        return np.array([
            metrics.cpu_percent,
            metrics.memory_percent,
            metrics.disk_io_read,
            metrics.disk_io_write,
            metrics.network_io_sent,
            metrics.network_io_recv,
            metrics.load_avg[0],
            metrics.load_avg[1],
            metrics.load_avg[2],
            metrics.process_count
        ])
        
    async def _training_loop(self):

        while self.running:
            try:

                metrics = await self._collect_metrics()
                if metrics:
                    self.metrics_history.append(metrics)
                    

                    if len(self.metrics_history) > 1000:
                        self.metrics_history = self.metrics_history[-800:]
                    

                    if len(self.metrics_history) >= 50 and len(self.metrics_history) % 100 == 0:
                        await self._retrain_model()
                        
                await asyncio.sleep(self.config.metrics_collection_interval)
                
            except Exception as e:
                self.logger.error(f"Ошибка в цикле обучения: {e}")
                await asyncio.sleep(5)
                
    async def _retrain_model(self):

        try:
            if len(self.metrics_history) < 20:
                return
                

            features = np.array([
                self._metrics_to_features(m) for m in self.metrics_history
            ])
            

            features_scaled = self.scaler.fit_transform(features)
            
            # Обучение
            self.model.fit(features_scaled)
            
            self.logger.info(f"🧠 Модель переобучена на {len(features)} образцах")
            
        except Exception as e:
            self.logger.error(f"Ошибка переобучения модели: {e}")
            
    async def get_prediction(self) -> Prediction:

        try:
            current_metrics = await self._collect_metrics()
            if not current_metrics or not self.model:
                return Prediction(0.0, "Нет данных", [], [], 0.0)
                

            features = self._metrics_to_features(current_metrics).reshape(1, -1)
            

            if len(self.metrics_history) > 20:
                features_scaled = self.scaler.transform(features)
            else:
                features_scaled = features
                

            anomaly_score = self.model.decision_function(features_scaled)[0]
            is_anomaly = self.model.predict(features_scaled)[0] == -1
            

            risk_level = max(0.0, min(1.0, (0.5 - anomaly_score) * 2))
            

            affected_resources = []
            recommendations = []
            
            if current_metrics.cpu_percent > 80:
                affected_resources.append("CPU")
                recommendations.append("Ограничить CPU-интенсивные процессы")
                
            if current_metrics.memory_percent > 85:
                affected_resources.append("Memory")
                recommendations.append("Освободить память")
                
            if current_metrics.load_avg[0] > psutil.cpu_count() * 2:
                affected_resources.append("System Load")
                recommendations.append("Снизить нагрузку на систему")
                
            description = "Система работает нормально"
            if risk_level > 0.7:
                description = "Высокий риск падения производительности"
            elif risk_level > 0.4:
                description = "Умеренный риск проблем с производительностью"
            elif risk_level > 0.2:
                description = "Небольшие отклонения в работе системы"
                
            confidence = min(1.0, len(self.metrics_history) / 100.0)
            
            return Prediction(
                risk_level=risk_level,
                description=description,
                affected_resources=affected_resources,
                recommended_actions=recommendations,
                confidence=confidence
            )
            
        except Exception as e:
            self.logger.error(f"Ошибка получения прогноза: {e}")
            return Prediction(0.0, f"Ошибка: {e}", [], [], 0.0)
            
    async def get_system_state(self) -> Dict:

        metrics = await self._collect_metrics()
        if not metrics:
            return {}
            
        return {
            'cpu_percent': metrics.cpu_percent,
            'memory_percent': metrics.memory_percent,
            'load_avg': metrics.load_avg[0],
            'process_count': metrics.process_count,
            'disk_activity': (metrics.disk_io_read + metrics.disk_io_write) / 1024 / 1024,  # MB
            'network_activity': (metrics.network_io_sent + metrics.network_io_recv) / 1024 / 1024  # MB
        }
