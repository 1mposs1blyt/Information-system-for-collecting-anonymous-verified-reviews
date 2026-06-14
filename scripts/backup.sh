#!/bin/bash

# Автоматически загружаем доступы и пароли из файла .env в корне проекта
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

# Если переменные для PostgreSQL не заданы, ставим стандартные значения по умолчанию
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

# Генерируем уникальное имя файла с текущей датой и временем
TIMESTAMP=$(date +"%Y_%m_%d_%H%M%S")
BACKUP_DIR="backups"
SQL_BACKUP="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
FINAL_ZIP="$BACKUP_DIR/backup_$TIMESTAMP.zip"

echo "=== ЗАПУСК РЕЗЕРВНОГО КОПИРОВАНИЯ ==="

# 1. Делаем горячий дамп базы данных PostgreSQL
echo "Создание дампа базы данных $DB_NAME..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f "$SQL_BACKUP"

if [ $? -eq 0 ]; then
    echo "Дамп базы успешно создан: $SQL_BACKUP"
else
    echo "ОШИБКА: Не удалось создать дамп базы данных!"
    exit 1
fi

# 2. Упаковываем дамп базы данных в ZIP архив для экономии места
echo "Архивация данных..."
zip -r "$FINAL_ZIP" "$SQL_BACKUP"

# Удаляем промежуточный .sql файл, оставляя только готовый архив
rm "$SQL_BACKUP"

echo "=== БЭКАП УСПЕШНО СОЗДАН: $FINAL_ZIP ==="
