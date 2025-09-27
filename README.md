# Tears in Rain  - Техническая документация

# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv python3-dev
sudo apt install libasound2-dev portaudio19-dev build-essential

# Клонирование/распаковка проекта
cd ~/Gazan

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Создание необходимых директорий
mkdir -p logs models

# Активация окружения
source venv/bin/activate

# Обычный запуск
python main.py

# Запуск с правами root 
sudo venv/bin/python main.py

# Запуск в фоне
nohup sudo venv/bin/python main.py > logs/output.log 2>&1 &

# Просмотр логов
tail -f logs/tears_in_rain.log

# Проверка процесса
ps aux | grep "main.py"

# Остановка
kill -TERM <PID>
\`\`\`


## Проверка работы
После запуска система должна:
1. Создать файлы логов в `logs/`
2. Сохранить модели ИИ в `models/`
3. Воспроизводить фоновые звуки системы
4. Логировать метрики каждую секунду
5. Реагировать на высокую нагрузку звуковыми алертами

### ЗАПУСК ВЕБ ИНТЕРФЕЙСА
# Установите Node.js и npm
##Создайте новый проект
# npx create-react-app my-app 
## cd /путь/к/вашему/проекту
# npm start
