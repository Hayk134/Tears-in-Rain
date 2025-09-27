

import asyncio
import numpy as np
import threading
import time
from typing import Dict, Optional
import pygame
import math

class EchoesOfOrion:

    def __init__(self, config):
        self.config = config
        self.logger = config.logger
        self.running = False


        try:
            pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
            self.audio_enabled = True
        except Exception as e:
            self.logger.warning(f"⚠️  Аудио недоступно: {e}")
            self.audio_enabled = False
            

        self.base_frequency = 220  # Базовая частота (A3)
        self.current_soundscape = {}
        self.alert_playing = False
        
    async def start(self):

        self.logger.info("🎵 Запуск Echoes of Orion...")
        
        if not self.audio_enabled:
            self.logger.info("🔇 Аудио отключено, работа в режиме логирования")
            
        self.running = True
        

        if self.audio_enabled:
            threading.Thread(target=self._soundscape_thread, daemon=True).start()
            
    async def stop(self):

        self.running = False
        
        if self.audio_enabled:
            pygame.mixer.quit()
            
    async def update_soundscape(self, system_state: Dict):

        try:
            if not system_state:
                return
                

            soundscape = self._metrics_to_sound(system_state)
            self.current_soundscape = soundscape
            

            self._log_soundscape(soundscape)
            
        except Exception as e:
            self.logger.error(f"Ошибка обновления звукового ландшафта: {e}")
            
    def _metrics_to_sound(self, system_state: Dict) -> Dict:

        soundscape = {}
        

        cpu_percent = system_state.get('cpu_percent', 0)
        soundscape['base_frequency'] = self.base_frequency + (cpu_percent * 2)  # 220-420 Hz
        

        memory_percent = system_state.get('memory_percent', 0)
        soundscape['background_volume'] = min(0.3, memory_percent / 100 * 0.3)
        

        load_avg = system_state.get('load_avg', 0)
        soundscape['click_frequency'] = min(10, load_avg)  # Клики в секунду
        

        disk_activity = system_state.get('disk_activity', 0)
        soundscape['disk_noise_intensity'] = min(0.2, disk_activity / 100 * 0.2)
        

        network_activity = system_state.get('network_activity', 0)
        soundscape['network_pings'] = min(5, network_activity / 10)

        process_count = system_state.get('process_count', 0)
        soundscape['harmonic_complexity'] = min(5, process_count / 50)
        
        return soundscape
        
    def _log_soundscape(self, soundscape: Dict):

        sound_description = []
        

        base_freq = soundscape.get('base_frequency', self.base_frequency)
        if base_freq > 300:
            sound_description.append("высокий тон CPU")
        elif base_freq > 250:
            sound_description.append("средний тон CPU")
        else:
            sound_description.append("низкий тон CPU")
            

        bg_volume = soundscape.get('background_volume', 0)
        if bg_volume > 0.2:
            sound_description.append("интенсивный гул памяти")
        elif bg_volume > 0.1:
            sound_description.append("умеренный гул памяти")
            

        click_freq = soundscape.get('click_frequency', 0)
        if click_freq > 5:
            sound_description.append("частые клики нагрузки")
        elif click_freq > 2:
            sound_description.append("редкие клики нагрузки")

        disk_intensity = soundscape.get('disk_noise_intensity', 0)
        if disk_intensity > 0.1:
            sound_description.append("шуршание диска")

        network_pings = soundscape.get('network_pings', 0)
        if network_pings > 2:
            sound_description.append("сетевые пинги")
            
        if sound_description:
            self.logger.info(f"🎼 Звуковой ландшафт: {', '.join(sound_description)}")
        else:
            self.logger.info("🎼 Звуковой ландшафт: тишина системы")
            
    async def play_alert(self, risk_level: float):

        try:
            if self.alert_playing:
                return
                
            self.alert_playing = True
            

            if risk_level > 0.8:
                alert_type = "критическое"
                self.logger.warning("🚨 КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ - резкие удары!")
            elif risk_level > 0.6:
                alert_type = "высокое"
                self.logger.warning("⚠️  ВЫСОКИЙ РИСК - тревожный тон!")
            elif risk_level > 0.4:
                alert_type = "умеренное"
                self.logger.info("🔔 Умеренный риск - предупреждающий сигнал")
            else:
                alert_type = "низкое"
                self.logger.info("🔕 Низкий риск - мягкое уведомление")
                

            if self.audio_enabled:
                await self._generate_alert_sound(risk_level)
                

            await asyncio.sleep(5)
            self.alert_playing = False
            
        except Exception as e:
            self.logger.error(f"Ошибка воспроизведения предупреждения: {e}")
            self.alert_playing = False
            
    async def _generate_alert_sound(self, risk_level: float):

        try:

            duration = 0.5 + risk_level  # 0.5-1.5 секунды
            frequency = 440 + (risk_level * 440)  # 440-880 Hz
            volume = 0.3 + (risk_level * 0.4)  # 0.3-0.7
            

            sample_rate = 22050
            frames = int(duration * sample_rate)
            

            sound_array = np.zeros((frames, 2), dtype=np.int16)
            
            for i in range(frames):

                t = i / sample_rate
                amplitude = volume * (1 - t / duration) * 32767
                

                sample = amplitude * math.sin(2 * math.pi * frequency * t)
                

                if risk_level > 0.6:
                    sample += amplitude * 0.3 * math.sin(2 * math.pi * frequency * 1.5 * t)
                    
                sound_array[i] = [int(sample), int(sample)]
                

            sound = pygame.sndarray.make_sound(sound_array)
            sound.play()
            

            await asyncio.sleep(duration)
            
        except Exception as e:
            self.logger.error(f"Ошибка генерации звука: {e}")
            
    def _soundscape_thread(self):

        try:
            while self.running:
                if self.current_soundscape and not self.alert_playing:

                    self._generate_background_sound()
                    
                time.sleep(0.1)  # 100ms обновления
                
        except Exception as e:
            self.logger.error(f"Ошибка в потоке звукового ландшафта: {e}")
            
    def _generate_background_sound(self):

        try:

            
            bg_volume = self.current_soundscape.get('background_volume', 0)
            if bg_volume > 0.05:  # Минимальный порог для воспроизведения

                duration = 0.1
                frequency = self.current_soundscape.get('base_frequency', self.base_frequency)
                
                sample_rate = 22050
                frames = int(duration * sample_rate)
                sound_array = np.zeros((frames, 2), dtype=np.int16)
                
                for i in range(frames):
                    t = i / sample_rate
                    amplitude = bg_volume * 16384  # Половина от максимальной амплитуды
                    
                    sample = amplitude * math.sin(2 * math.pi * frequency * t)
                    sound_array[i] = [int(sample), int(sample)]
                    
                sound = pygame.sndarray.make_sound(sound_array)
                sound.play()
                
        except Exception as e:
            self.logger.debug(f"Ошибка генерации фонового звука: {e}")
