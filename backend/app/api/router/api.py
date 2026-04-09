from fastapi import APIRouter
from app.api.endpoints import auth, predict, history

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(predict.router, prefix="/predict", tags=["prediction"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
