
import asyncio
import subprocess
import os
import psutil
from typing import List, Dict
from agents.batty_agent import Prediction

class TannhauserGate:

    
    def __init__(self, config):
        self.config = config
        self.logger = config.logger
        self.running = False
        self.active_throttles = {}
        
    async def start(self):

        self.logger.info("🚪 Запуск Tannhäuser Gate...")
        
        # Проверка прав доступа
        if os.geteuid() != 0:
            self.logger.warning("⚠️  Для полной функциональности требуются права root")
            
        self.running = True
        

        asyncio.create_task(self._monitor_cgroups())
        
    async def stop(self):

        self.running = False

        await self._remove_all_throttles()
        
    async def apply_throttling(self, prediction: Prediction):

        try:
            self.logger.info(f"🎛️  Применение ограничений для риска {prediction.risk_level:.2f}")
            

            throttle_level = min(0.8, prediction.risk_level)
            
            if "CPU" in prediction.affected_resources:
                await self._throttle_cpu(throttle_level)
                
            if "Memory" in prediction.affected_resources:
                await self._throttle_memory(throttle_level)
                
            if "System Load" in prediction.affected_resources:
                await self._throttle_processes(throttle_level)
                
        except Exception as e:
            self.logger.error(f"Ошибка применения ограничений: {e}")
            
    async def _throttle_cpu(self, level: float):

        try:

            high_cpu_processes = []
            
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'nice']):
                try:
                    if proc.info['cpu_percent'] > 20 and proc.info['nice'] <= 0:
                        high_cpu_processes.append(proc.info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
                    

            high_cpu_processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
            

            throttled_count = 0
            for proc_info in high_cpu_processes[:5]:  # Топ-5 процессов
                try:
                    pid = proc_info['pid']
                    new_nice = min(19, int(10 * level))
                    

                    subprocess.run(['renice', str(new_nice), str(pid)], 
                                 capture_output=True, check=False)
                    
                    self.active_throttles[f"cpu_{pid}"] = {
                        'type': 'cpu_nice',
                        'pid': pid,
                        'original_nice': proc_info['nice'],
                        'new_nice': new_nice
                    }
                    
                    throttled_count += 1
                    
                except Exception as e:
                    self.logger.debug(f"Не удалось изменить приоритет процесса {pid}: {e}")
                    
            if throttled_count > 0:
                self.logger.info(f"🔧 Изменен приоритет {throttled_count} процессов")
                
        except Exception as e:
            self.logger.error(f"Ошибка ограничения CPU: {e}")
            
    async def _throttle_memory(self, level: float):

        try:

            high_mem_processes = []
            
            for proc in psutil.process_iter(['pid', 'name', 'memory_percent']):
                try:
                    if proc.info['memory_percent'] > 5:  # Более 5% памяти
                        high_mem_processes.append(proc.info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
                    

            high_mem_processes.sort(key=lambda x: x['memory_percent'], reverse=True)
            

            if high_mem_processes:
                self.logger.info(f"🧠 Найдено {len(high_mem_processes)} процессов с высоким потреблением памяти")
                
        except Exception as e:
            self.logger.error(f"Ошибка анализа памяти: {e}")
            
    async def _throttle_processes(self, level: float):

        try:

            user_processes = {}
            
            for proc in psutil.process_iter(['pid', 'username', 'status']):
                try:
                    username = proc.info['username']
                    if username not in ['root', 'system']:  # Исключаем системные процессы
                        if username not in user_processes:
                            user_processes[username] = []
                        user_processes[username].append(proc.info['pid'])
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
                    

            total_user_processes = sum(len(pids) for pids in user_processes.values())
            self.logger.info(f"📊 Всего пользовательских процессов: {total_user_processes}")
            
        except Exception as e:
            self.logger.error(f"Ошибка анализа процессов: {e}")
            
    async def _monitor_cgroups(self):

        while self.running:
            try:

                if os.path.exists('/sys/fs/cgroup'):

                    cgroup_info = await self._read_cgroup_stats()
                    
                    if cgroup_info:
                        self.logger.debug(f"📈 Статистика cgroups: {len(cgroup_info)} групп")
                        
                await asyncio.sleep(30)  # Проверка каждые 30 секунд
                
            except Exception as e:
                self.logger.error(f"Ошибка мониторинга cgroups: {e}")
                await asyncio.sleep(60)
                
    async def _read_cgroup_stats(self) -> Dict:

        try:
            stats = {}
            

            cpu_stat_path = '/sys/fs/cgroup/cpu.stat'
            if os.path.exists(cpu_stat_path):
                with open(cpu_stat_path, 'r') as f:
                    for line in f:
                        if 'usage_usec' in line:
                            stats['cpu_usage'] = int(line.split()[1])
                            

            memory_current_path = '/sys/fs/cgroup/memory.current'
            if os.path.exists(memory_current_path):
                with open(memory_current_path, 'r') as f:
                    stats['memory_current'] = int(f.read().strip())
                    
            return stats
            
        except Exception as e:
            self.logger.debug(f"Не удалось прочитать cgroup статистику: {e}")
            return {}
            
    async def _remove_all_throttles(self):

        try:
            removed_count = 0
            
            for throttle_id, throttle_info in self.active_throttles.items():
                try:
                    if throttle_info['type'] == 'cpu_nice':

                        pid = throttle_info['pid']
                        original_nice = throttle_info['original_nice']
                        
                        subprocess.run(['renice', str(original_nice), str(pid)], 
                                     capture_output=True, check=False)
                        removed_count += 1
                        
                except Exception as e:
                    self.logger.debug(f"Не удалось снять ограничение {throttle_id}: {e}")
                    
            self.active_throttles.clear()
            
            if removed_count > 0:
                self.logger.info(f"🔓 Сняты ограничения с {removed_count} процессов")
                
        except Exception as e:
            self.logger.error(f"Ошибка снятия ограничений: {e}")
