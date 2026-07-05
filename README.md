# АРТ-Кавказ

Адаптивный сайт-визитка фонда «АРТ-Кавказ». Next.js (App Router) фронтенд + Wagtail (Django) CMS-бэкенд, связанные через REST API с ISR/on-demand revalidation.

Подробности архитектуры и решений — в `.claude/plans` (см. историю чата) или ниже в кратком виде.

## Структура

```
backend/    Wagtail CMS: админка, модели контента, REST API (/api/v2/)
frontend/   Next.js: страницы сайта, SEO, потребление Wagtail API
```

## Backend (Wagtail)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # при необходимости поменять секреты/CORS
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_content  # наполняет плейсхолдер-контентом (идемпотентно)
python manage.py runserver 0.0.0.0:8000
```

Админка: http://localhost:8000/admin/
REST API: http://localhost:8000/api/v2/

## Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local     # при необходимости поменять URL/секреты
npm run dev
```

Сайт: http://localhost:3000

## Как обновляется контент

Публикация/снятие с публикации страницы в Wagtail (сигнал `page_published`/`page_unpublished`,
см. `backend/core/signals.py`) шлёт webhook на `frontend/app/api/revalidate/route.ts`, который
инвалидирует кэш Next.js — новый контент появляется без пересборки и передеплоя.

`NEXT_REVALIDATE_SECRET` (backend) и `REVALIDATE_SECRET` (frontend) должны совпадать.

## Дальнейшие шаги

- Заменить плейсхолдер-контент (фото, документы, состав совета, партнёры, СМИ) реальными данными через админку Wagtail.
- Загрузить логотип в Настройках сайта (Wagtail admin → Settings → Site Settings).
- Зарегистрировать домен и обновить `NEXT_PUBLIC_SITE_URL` (frontend) и `WAGTAILADMIN_BASE_URL` (backend).
- Подключить аналитику (Яндекс.Метрика/GA), когда потребуется.
