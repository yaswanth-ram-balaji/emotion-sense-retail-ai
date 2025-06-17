
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
import traceback

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageInput(BaseModel):
    image_base64: str
    method: str = "opencv"

def log_error_to_file(msg):
    print(f"ERROR: {msg}")

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    print("DEBUG: detect_face called")
    try:
        # Decode image
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        np_img = np.array(img)
        
        # Convert to OpenCV format
        cv_img = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
        
        # Load OpenCV face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Convert to grayscale for detection
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return {"face_crop_base64": None}
        
        # Get the largest face
        largest_face = max(faces, key=lambda face: face[2] * face[3])
        x, y, w, h = largest_face
        
        # Crop face from original RGB image
        cropped_face = np_img[y:y+h, x:x+w]
        
        # Convert back to PIL and encode
        cropped_pil = Image.fromarray(cropped_face)
        with BytesIO() as buf:
            cropped_pil.save(buf, format="JPEG")
            face_bytes = buf.getvalue()
            face_base64 = base64.b64encode(face_bytes).decode("utf-8")
        
        return {"face_crop_base64": "data:image/jpeg;base64," + face_base64}
        
    except Exception as e:
        print(f"ERROR: {e}")
        return {"face_crop_base64": None}

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    # For now, return mock emotion data since we removed heavy ML libraries
    return {
        "emotion": "happy",
        "confidence": 0.85,
        "emotions": {
            "happy": 0.85,
            "neutral": 0.10,
            "sad": 0.03,
            "angry": 0.01,
            "surprise": 0.01
        }
    }

@app.get("/emotion-log")
async def get_emotion_log():
    # Return empty log for now
    return []

@app.get("/")
async def root():
    return {"message": "Emotion Detection API is running!"}

@app.get("/docs")
async def docs():
    return {"message": "API Documentation available at /docs"}
