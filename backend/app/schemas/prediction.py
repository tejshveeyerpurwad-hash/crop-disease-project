from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionResponse(BaseModel):
    id: Optional[int]
    crop_type: str
    disease_status: str
    confidence: float
    confidence_pct: str
    label: str
    disease_info: str
    prevention: str
    treatment: str
    treatment_recommendation: str  # Kept for legacy compatibility
    image_path: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
