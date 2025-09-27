

import asyncio
import logging
import signal
import sys
from pathlib import Path

from agents.batty_agent import BattyAgent
from modules.tannhauser_gate import TannhauserGate
from modules.echoes_of_orion import EchoesOfOrion
from utils.config import Config
from utils.logger import setup_logger

class TearsInRainProtocol:

    
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = Config(config_path)
        self.logger = setup_logger("TearsInRain", self.config.log_level)
        

        self.batty_agent = BattyAgent(self.config)
        self.tannhauser_gate = TannhauserGate(self.config)
        self.echoes_of_orion = EchoesOfOrion(self.config)
        
        self.running = False
        
    async def start(self):

        self.logger.info("🌧️  Запуск Tears in Rain Protocol...")
        
        try:

            await asyncio.gather(
                self.batty_agent.start(),
                self.tannhauser_gate.start(),
                self.echoes_of_orion.start()
            )
            
            self.running = True
            self.logger.info("✅ Протокол успешно запущен")
            

            await self._main_loop()
            
        except Exception as e:
            self.logger.error(f"❌ Ошибка запуска протокола: {e}")
            await self.stop()
            
    async def _main_loop(self):

        while self.running:
            try:

                prediction = await self.batty_agent.get_prediction()
                
                if prediction.risk_level > self.config.risk_threshold:
                    self.logger.warning(f"⚠️  Обнаружен риск: {prediction.description}")
                    

                    await self.tannhauser_gate.apply_throttling(prediction)
                    

                    await self.echoes_of_orion.play_alert(prediction.risk_level)
                

                system_state = await self.batty_agent.get_system_state()
                await self.echoes_of_orion.update_soundscape(system_state)
                
                await asyncio.sleep(self.config.monitoring_interval)
                
            except Exception as e:
                self.logger.error(f"Ошибка в основном цикле: {e}")
                await asyncio.sleep(1)
                
    async def stop(self):

        self.logger.info("🛑 Остановка Tears in Rain Protocol...")
        self.running = False
        
        await asyncio.gather(
            self.batty_agent.stop(),
            self.tannhauser_gate.stop(),
            self.echoes_of_orion.stop(),
            return_exceptions=True
        )
        
        self.logger.info("✅ Протокол остановлен")

def signal_handler(signum, frame):

    print("\n🌧️  Получен сигнал завершения...")
    sys.exit(0)

async def main():

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    protocol = TearsInRainProtocol()
    
    try:
        await protocol.start()
    except KeyboardInterrupt:
        await protocol.stop()
    except Exception as e:
        logging.error(f"Критическая ошибка: {e}")
        await protocol.stop()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
