#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

echo "=== ЗАПУСК ВОССТАНОВЛЕНИЯ СИСТЕМЫ ИЗ НУЛЯ ==="

# Ищем самый последний созданный zip-архив в папке backups
LATEST_BACKUP=$(ls -t backups/backup_*.zip 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ОШИБКА: Ни одного файла бэкапа в папке backups/ не найдено!"
    exit 1
fi

echo "Используется последний архив бэкапа: $LATEST_BACKUP"

# 1. Распаковываем sql-дамп из архива
echo "Распаковка архива..."
unzip -o "$LATEST_BACKUP"

# Находим имя распакованного .sql файла
EXTRACTED_SQL=$(ls -t backups/db_backup_*.sql 2>/dev/null | head -n 1)

# 2. Полностью очищаем старую базу данных и накатываем дамп заново
echo "Пересоздание и очистка базы данных $DB_NAME..."
dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER --if-exists $DB_NAME
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

echo "Накат структуры и данных из дампа..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$EXTRACTED_SQL"

# Удаляем распакованный временный .sql файл
rm "$EXTRACTED_SQL"

echo "=== СИСТЕМА УСПЕШНО РЕАНИМИРОВАНА ИЗ БЭКАПА ==="
