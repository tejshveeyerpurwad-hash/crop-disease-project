from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionResponse(BaseModel):
    id: Optional[int]
    crop_type: str
    disease_status: str
    confidence: float
    treatment_recommendation: str
    image_path: str
    heatmap_path: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
