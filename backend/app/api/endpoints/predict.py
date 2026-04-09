from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.ml_service import ml_service
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionResponse
from app.api.endpoints.deps import get_current_user
from app.models.user import User
import os
import uuid
import aiofiles

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=PredictionResponse)
async def predict_disease(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
        
    # Get ML result
    result = await ml_service.predict(file_path)
    
    # Save to db
    prediction_record = Prediction(
        user_id=current_user.id,
        crop_type=result["crop_type"],
        disease_status=result["disease_status"],
        confidence=result["confidence"],
        treatment_recommendation=result["treatment"],
        image_path=f"/uploads/{unique_filename}",
        heatmap_path=result["heatmap_url"]
    )
    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)
    
    return prediction_record
