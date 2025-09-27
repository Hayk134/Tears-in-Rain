#!/usr/bin/env python3


import subprocess
import sys
import os
import shutil

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3.8):
        print("❌ Требуется Python 3.8 или выше")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")

def install_system_packages():

    print("📦 Установка системных зависимостей...")
    

    if shutil.which('apt'):
        packages = [
            'python3-dev',
            'libasound2-dev',  # Для pygame audio
            'portaudio19-dev', # Для аудио
            'build-essential'
        ]
        
        for package in packages:
            try:
                subprocess.run(['sudo', 'apt', 'install', '-y', package], 
                             check=True, capture_output=True)
                print(f"✅ Установлен {package}")
            except subprocess.CalledProcessError:
                print(f"⚠️  Не удалось установить {package}")
                

    elif shutil.which('yum'):
        packages = [
            'python3-devel',
            'alsa-lib-devel',
            'portaudio-devel',
            'gcc'
        ]
        
        for package in packages:
            try:
                subprocess.run(['sudo', 'yum', 'install', '-y', package], 
                             check=True, capture_output=True)
                print(f"✅ Установлен {package}")
            except subprocess.CalledProcessError:
                print(f"⚠️  Не удалось установить {package}")
    else:
        print("⚠️  Автоматическая установка системных пакетов недоступна")

def install_python_packages():

    print("🐍 Установка Python зависимостей...")
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ Python пакеты установлены")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка установки Python пакетов: {e}")
        sys.exit(1)

def create_directories():

    print("📁 Создание директорий...")
    
    directories = [
        'logs',
        'models',
        'config',
        'data'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Создана директория {directory}")

def check_permissions():

    print("🔐 Проверка прав доступа...")
    
    if os.geteuid() == 0:
        print("✅ Запуск от root - полная функциональность доступна")
    else:
        print("⚠️  Запуск от обычного пользователя - ограниченная функциональность")
        print("   Для полной функциональности запустите с sudo")

def main():

    print("🌧️  Установка Tears in Rain Protocol")
    print("=" * 50)
    
    check_python_version()
    install_system_packages()
    install_python_packages()
    create_directories()
    check_permissions()
    
    print("\n✅ Установка завершена!")
    print("Для запуска используйте: python3 main.py")

if __name__ == "__main__":
    main()
