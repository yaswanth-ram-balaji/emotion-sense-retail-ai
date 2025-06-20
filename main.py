
import base64
from io import BytesIO
from PIL import Image
import numpy as np
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
    method: str = "deepface"

class EmotionCompareInput(BaseModel):
    entry: str
    exit: str

def log_error_to_file(msg):
    with open("backend_errors.log", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running"}

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    try:
        # Decode image
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        np_img = np.array(img)

        if payload.method == "deepface":
            try:
                from deepface.detectors import FaceDetector
                detector_name = "opencv"
                detector = FaceDetector.build_model(detector_name)
                detected_faces = FaceDetector.detect_faces(detector_name, detector, np_img)
                
                if not detected_faces:
                    return {"face_crop_base64": None}
                
                # Get largest face
                faces_sorted = sorted(
                    detected_faces,
                    key=lambda d: (d[1][2] * d[1][3]),
                    reverse=True,
                )
                face_region = faces_sorted[0][1]
                x, y, w, h = face_region
                x, y = max(0, x), max(0, y)
                cropped_face = np_img[y:y+h, x:x+w]
                
                if cropped_face.size == 0:
                    return {"face_crop_base64": None}
                
                cropped_pil = Image.fromarray(cropped_face)
                with BytesIO() as buf:
                    cropped_pil.save(buf, format="JPEG")
                    face_bytes = buf.getvalue()
                    face_base64 = base64.b64encode(face_bytes).decode("utf-8")
                
                return {"face_crop_base64": "data:image/jpeg;base64," + face_base64}
            except Exception as e:
                log_error_to_file(f"DeepFace error: {e}")
                return {"face_crop_base64": None}
        else:
            return {"face_crop_base64": payload.image_base64}
    except Exception as e:
        log_error_to_file(f"Face detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    try:
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        np_img = np.array(img)

        if payload.method == "deepface":
            try:
                from deepface import DeepFace
                result = DeepFace.analyze(np_img, actions=["emotion"], enforce_detection=False)
                
                if isinstance(result, list):
                    result = result[0]
                
                emotion_scores = result.get("emotion", {})
                dominant_emotion = result.get("dominant_emotion", "neutral")
                confidence = emotion_scores.get(dominant_emotion, 0.85) / 100.0 if emotion_scores else 0.85
                
                # Normalize scores
                normalized_scores = {}
                if emotion_scores:
                    total = sum(emotion_scores.values())
                    if total > 0:
                        normalized_scores = {k: v/total for k, v in emotion_scores.items()}
                
                return {
                    "emotion": dominant_emotion,
                    "confidence": confidence,
                    "emotion_scores": normalized_scores
                }
            except Exception as e:
                log_error_to_file(f"DeepFace emotion analysis error: {e}")
                return {
                    "emotion": "neutral",
                    "confidence": 0.5,
                    "emotion_scores": {"neutral": 1.0}
                }
        else:
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "emotion_scores": {"neutral": 1.0}
            }
    except Exception as e:
        log_error_to_file(f"Emotion analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare-emotion")
async def compare_emotion(payload: EmotionCompareInput):
    try:
        entry = payload.entry.lower()
        exit_emotion = payload.exit.lower()
        
        positive_emotions = ["happy", "joy", "surprise"]
        negative_emotions = ["angry", "sad", "fear", "disgust"]
        
        entry_score = 1 if entry in positive_emotions else (-1 if entry in negative_emotions else 0)
        exit_score = 1 if exit_emotion in positive_emotions else (-1 if exit_emotion in negative_emotions else 0)
        
        delta = exit_score - entry_score
        
        if delta > 0:
            satisfaction = "Improved"
        elif delta < 0:
            satisfaction = "Declined"
        else:
            satisfaction = "Unchanged"
        
        delta_text = f"+{delta}" if delta > 0 else str(delta)
        
        return {
            "satisfaction": satisfaction,
            "delta": delta_text
        }
    except Exception as e:
        log_error_to_file(f"Compare emotion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/emotion-log")
async def get_emotion_log():
    return []

@app.get("/")
async def root():
    return {"message": "Emotion Detection API is running"}
