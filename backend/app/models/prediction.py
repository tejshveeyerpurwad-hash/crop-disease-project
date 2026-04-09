from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Core detection
    label = Column(String)
    crop_type = Column(String)
    disease_status = Column(String)
    confidence = Column(Float)
    confidence_pct = Column(String)
    
    # Detailed info
    disease_info = Column(String)
    prevention = Column(String)
    treatment = Column(String)
    treatment_recommendation = Column(String) # For compatibility
    
    image_path = Column(String)
    heatmap_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")
