from __future__ import annotations
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

load_dotenv()
from src.db.database import init_db
from src.routers import box_router, feedback_router
from src.routers.auth_router import router as auth_router
from src.logger_config import logger


# Современный способ обработки запуска для исправления схем Pydantic на Python 3.14
@asynccontextmanager
async def lifespan(app: FastAPI):
    for route in app.routes:
        if hasattr(route, "dependant") and route.dependant.call:
            for param in route.dependant.body_params:
                if hasattr(param.type_, "model_rebuild"):
                    try:
                        param.type_.model_rebuild()
                    except Exception:
                        pass
    yield


# Передаем исправленный жизненный цикл в приложение
app = FastAPI(lifespan=lifespan)

logger.info("Backend statred successfully!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)
app.include_router(box_router.router)
app.include_router(feedback_router.router)
app.include_router(auth_router)

# Create tables at import time so TestClient/pytest works reliably.
init_db()


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})[
        "BearerAuth"
    ] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "token",
    }
    for path in openapi_schema.get("paths", {}).values():
        for operation in path.values():
            if isinstance(operation, dict):
                operation.setdefault("security", []).append({"BearerAuth": []})
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get("/", response_class=HTMLResponse)
def root():
    logger.info("Main backend route!")
    return HTMLResponse("""
        <html>
            <head>
                <title>Anonymous Feedback API</title>
            </head>
            <body>
                <h1>Anonymous Feedback API</h1>
                <p>Перейдите на страницу документации API, чтобы увидеть доступные команды.</p>
                <ul>
                    <li><a href="/docs">Swagger UI</a> — браузерная документация OpenAPI</li>
                    <li><a href="/redoc">ReDoc</a> — альтернативная документация OpenAPI</li>
                </ul>
                <p>Схема OpenAPI доступна по адресу <code>/openapi.json</code>.</p>
            </body>
        </html>
        """)


@app.get("/health")
def health():
    logger.info("Health backend route!")
    return {"status": "ok"}
