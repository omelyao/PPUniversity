Job Application System

Система управления вакансиями и заявками на работу с использованием Node.js, Express и SQLite.

Требования

- Node.js (версия 14.0.0 или выше)
- npm (Node Package Manager)

Установка

1. Клонируйте репозиторий:
```bash
git clone <ваш-репозиторий>
cd <папка-проекта>
```

2. Установите зависимости:
```bash
npm install
```

Запуск приложения

1. Запустите сервер:
```bash
node app.js
```

После запуска вы увидите сообщения:
- "Database synchronized successfully" - база данных успешно инициализирована
- "Server running on port 3000" - сервер запущен на порту 3000

База данных

Проект использует SQLite в качестве базы данных. База данных автоматически создается в файле `database.sqlite` при первом запуске приложения. При последующих запусках:

- Если база данных уже существует, она будет автоматически обновлена с сохранением данных
- Новые таблицы будут созданы автоматически
- Существующие таблицы будут обновлены при необходимости
- Данные в существующих таблицах сохраняются

API Endpoints и примеры использования

Вакансии (Jobs)

1. Создание новой вакансии
```bash
curl -X POST http://localhost:3000/api/jobs \
-H "Content-Type: application/json" \
-d '{
  "title": "Frontend Developer",
  "company": "Tech Company",
  "location": "Moscow",
  "description": "Мы ищем опытного Frontend разработчика",
  "requirements": "React, JavaScript, HTML, CSS"
}'
```

2. Получение списка всех вакансий
```bash
curl http://localhost:3000/api/jobs
```

3. Получение конкретной вакансии
```bash
curl http://localhost:3000/api/jobs/1
```

4. Обновление вакансии
```bash
curl -X PUT http://localhost:3000/api/jobs/1 \
-H "Content-Type: application/json" \
-d '{
  "title": "Senior Frontend Developer",
  "company": "Tech Company",
  "location": "Moscow",
  "description": "Обновленное описание",
  "requirements": "React, JavaScript, HTML, CSS, TypeScript"
}'
```

5. Удаление вакансии
```bash
curl -X DELETE http://localhost:3000/api/jobs/1
```

Заявки (Applications)

1. Создание новой заявки
```bash
curl -X POST http://localhost:3000/api/applications \
-H "Content-Type: application/json" \
-d '{
  "JobId": 1,
  "applicantName": "Иван Иванов",
  "email": "ivan@example.com",
  "resume": "path/to/resume.pdf",
  "coverLetter": "Сопроводительное письмо"
}'
```

2. Получение списка всех заявок
```bash
curl http://localhost:3000/api/applications
```

3. Получение конкретной заявки
```bash
curl http://localhost:3000/api/applications/1
```

4. Обновление заявки
```bash
curl -X PUT http://localhost:3000/api/applications/1 \
-H "Content-Type: application/json" \
-d '{
  "status": "accepted",
  "coverLetter": "Обновленное сопроводительное письмо"
}'
```

5. Удаление заявки
```bash
curl -X DELETE http://localhost:3000/api/applications/1
```

Использование с Postman или другими инструментами

1. URL: `http://localhost:3000`
2. Заголовки для POST и PUT запросов:
   - Content-Type: application/json

Структура данных

Вакансия (Job):
```json
{
  "title": "Название вакансии",
  "company": "Название компании",
  "location": "Местоположение",
  "description": "Описание вакансии",
  "requirements": "Требования к кандидату",
  "status": "active" // или "closed"
}
```

Заявка (Application):
```json
{
  "JobId": 1,
  "applicantName": "Имя заявителя",
  "email": "email@example.com",
  "resume": "путь/к/резюме.pdf",
  "coverLetter": "Текст сопроводительного письма",
  "status": "pending" // или "accepted", "rejected"
}
```

Структура проекта

```
├── app.js                 # Основной файл приложения
├── src/
│   ├── config/           # Конфигурация базы данных
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты API
│   └── middleware/       # Промежуточные обработчики
├── public/              # Статические файлы
├── database.sqlite      # Файл базы данных (создается автоматически)
└── package.json         # Зависимости проекта
```

Решение проблем

1. Если возникает ошибка при запуске из-за существующей базы данных:
   ```bash
   rm database.sqlite    # для Linux/Mac
   # или
   del database.sqlite   # для Windows
   ```
   Затем перезапустите сервер.

2. Если порт 3000 занят, измените переменную окружения PORT:
   ```bash
   PORT=3001 node app.js
   ``` 
 
 
