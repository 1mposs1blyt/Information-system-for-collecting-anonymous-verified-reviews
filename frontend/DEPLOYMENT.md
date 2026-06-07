# Руководство администратора (Deployment Guide)

## 🖥️ Системные требования к серверу

* **ОС:** Ubuntu 22.04 LTS / Debian 11
* **Минимальные требования:** 1 vCPU, 2 ГБ ОЗУ (RAM), 20 ГБ SSD.
* **Рекомендуемые требования:** 2 vCPU, 4 ГБ ОЗУ (RAM), 40 ГБ SSD.

## 🌐 Конфигурация обратного прокси (Nginx)

Пример листинга конфигурационного файла `/etc/nginx/sites-available/reviews-system` для проксирования фронтенда и бэкенда:

```nginx
server {
    listen 80;
    server_name example.com;

    # Раздача статики фронтенда
    location / {
        root /var/www/frontend/dist;
        index index.html;
        try_files uri uri/ /index.html;
    }

    # Проксирование API запросов на бэкенд
    location /api/ {
        proxy_pass http://127.0.0;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
```

## 🚨 Регламент восстановления после сбоев

### Сценарий 1: Упала база данных

1. Проверить статус службы БД: `systemctl status postgresql` (или `docker ps`).
2. Проверить логи на наличие ошибок: `journalctl -u postgresql -n 50`.
3. Выполнить перезапуск службы: `systemctl restart postgresql`.
4. Если база повреждена, развернуть последний бэкап: `pg_restore -d dbname backup.sql`.

### Сценарий 2: Переполнился диск на сервере

1. Найти самые объемные папки: `df -h` и `du -sh /*`.
2. Очистить логи контейнеров Docker: `docker system prune -a --volumes`.
3. Удалить старые архивные системные логи: `rm -f /var/log/*.gz`.
