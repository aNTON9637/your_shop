#!/bin/bash

# Функция для проверки ошибок
check_error() {
    if [ $? -ne 0 ]; then
        echo "Ошибка: $1"
        exit 1
    fi
}

echo "=== Начинаем автоматический деплой ==="

echo "1. Сборка проекта..."
npm run build
check_error "Ошибка при сборке проекта"

echo "2. Добавляем изменения в git..."
git add .
git commit -m "Auto deploy $(date)"
check_error "Ошибка при коммите"

echo "3. Отправляем изменения на GitHub..."
git push origin main
check_error "Ошибка при пушинге"

echo "4. Ждем деплоя на Netlify..."
echo "Сайт будет доступен по адресам:"
echo "- https://mareket.netlify.app"
echo "- https://starlit-creponne-78c41c.netlify.app"
echo ""
echo "=== Деплой завершен ==="
