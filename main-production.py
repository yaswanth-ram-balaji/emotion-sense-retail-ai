# Production-ready FastAPI backend for mobile deployment
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import traceback
import sys
import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Emotion Detection API",
    description="AI-powered emotion detection for retail analytics",
    version="1.0.0"
)

# Production CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageInput(BaseModel):
    image_base64: str
    method: str = "deepface"

class EmotionComparison(BaseModel):
    entry: str
    exit: str

def log_error_to_file(msg):
    """Log errors for debugging in production"""
    try:
        with open("backend_errors.log", "a", encoding="utf-8") as f:
            f.write(msg + "\n")
    except:
        pass  # Fail silently if can't write to file

@app.get("/")
async def root():
    return {
        "message": "Emotion Detection API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": ["/detect-face", "/analyze_emotion", "/compare-emotion", "/docs"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "emotion-detection-api"}

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    print("DEBUG: detect_face called")
    try:
        try:
            print("DEBUG: Decoding image")
            imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
            print("DEBUG: Opening image with PIL")
            img = Image.open(BytesIO(imgdata)).convert("RGB")
            print("DEBUG: Converting image to numpy array")
            np_img = np.array(img)
        except Exception as e:
            error_msg = "ERROR: Error decoding or opening the image\n" + traceback.format_exc()
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

        # Try to detect face and crop
        if payload.method == "huggingface":
            # Face detection via HuggingFace (not implemented here — only DeepFace)
            error_msg = f"ERROR: Face detection for HuggingFace method not implemented."
            print(error_msg)
            log_error_to_file(error_msg)
            return {"face_crop_base64": payload.image_base64}
        elif payload.method == "deepface":
            try:
                print("DEBUG: Importing DeepFace")
                from deepface.detectors import FaceDetector
                detector_name = "opencv"
                detector = FaceDetector.build_model(detector_name)
                print("DEBUG: Running OpenCV FaceDetector.detect_faces")
                detected_faces = FaceDetector.detect_faces(detector_name, detector, np_img)
                print(f"DEBUG: Faces detected: {len(detected_faces)}")
                if not detected_faces:
                    raise Exception("No face detected")
                # Pick the face with largest box area (in case of multiple faces)
                faces_sorted = sorted(
                    detected_faces,
                    key=lambda d: (d[1][2] * d[1][3]),  # width * height
                    reverse=True,
                )
                face_region = faces_sorted[0][1]  # (x, y, w, h)
                x, y, w, h = face_region
                print(f"DEBUG: Cropping face at {x}, {y}, {w}, {h}")
                x, y = max(0, x), max(0, y)
                cropped_face = np_img[y:y+h, x:x+w]
                if cropped_face.size == 0:
                    raise Exception(f"Detected face region is empty (x={x}, y={y}, w={w}, h={h}).")
                cropped_pil = Image.fromarray(cropped_face)
                with BytesIO() as buf:
                    cropped_pil.save(buf, format="JPEG")
                    face_bytes = buf.getvalue()
                    face_base64 = base64.b64encode(face_bytes).decode("utf-8")
                # This is just the JPEG data, prepend data URL for frontend display
                return {"face_crop_base64": "data:image/jpeg;base64," + face_base64}
            except Exception as e:
                error_msg = f"ERROR: Exception in DeepFace face detection: {e}\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                return {"face_crop_base64": None}
        else:
            error_msg = f"ERROR: Invalid method specified\n"
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid method: {payload.method}")
    except Exception as e:
        error_msg = f"CRITICAL: Uncaught exception in detect_face: {e}\n" + traceback.format_exc()
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    print("DEBUG: analyze_emotion called")
    try:
        try:
            print("DEBUG: Decoding image for emotion analysis")
            imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
            img = Image.open(BytesIO(imgdata)).convert("RGB")
            np_img = np.array(img)
        except Exception as e:
            error_msg = "ERROR: Error decoding image for emotion analysis\n" + traceback.format_exc()
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

        try:
            print("DEBUG: Importing DeepFace for emotion analysis")
            from deepface import DeepFace
            
            print("DEBUG: Running DeepFace.analyze")
            result = DeepFace.analyze(
                img_path=np_img,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            print(f"DEBUG: DeepFace result: {result}")
            
            # Handle both single result and list of results
            if isinstance(result, list):
                result = result[0]
            
            emotion_scores = result.get('emotion', {})
            dominant_emotion = result.get('dominant_emotion', 'neutral')
            
            # Calculate confidence as the score of the dominant emotion
            confidence = emotion_scores.get(dominant_emotion, 0.0) / 100.0
            
            print(f"DEBUG: Detected emotion: {dominant_emotion} with confidence: {confidence}")
            
            return {
                "emotion": dominant_emotion,
                "confidence": confidence,
                "emotion_scores": emotion_scores
            }
            
        except Exception as e:
            error_msg = f"ERROR: Exception in DeepFace emotion analysis: {e}\n" + traceback.format_exc()
            print(error_msg)
            log_error_to_file(error_msg)
            # Return a fallback response
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "emotion_scores": {"neutral": 50.0}
            }
            
    except Exception as e:
        error_msg = f"CRITICAL: Uncaught exception in analyze_emotion: {e}\n" + traceback.format_exc()
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/compare-emotion")
async def compare_emotion(payload: EmotionComparison):
    """Compare entry and exit emotions to determine satisfaction"""
    try:
        entry = payload.entry.lower()
        exit = payload.exit.lower()
        
        # Define emotion categories
        positive_emotions = ['happy', 'surprise', 'neutral']
        negative_emotions = ['sad', 'angry', 'fear', 'disgust']
        
        # Determine satisfaction based on emotion transition
        entry_positive = entry in positive_emotions
        exit_positive = exit in positive_emotions
        
        if entry_positive and exit_positive:
            satisfaction = "Customer remained satisfied"
        elif not entry_positive and exit_positive:
            satisfaction = "Customer experience improved"
        elif entry_positive and not exit_positive:
            satisfaction = "Customer became unhappy"
        else:
            satisfaction = "Customer remained unsatisfied"
        
        delta = f"{entry.title()} → {exit.title()}"
        
        return {
            "satisfaction": satisfaction,
            "delta": delta,
            "entry_emotion": entry,
            "exit_emotion": exit
        }
        
    except Exception as e:
        error_msg = f"ERROR: Exception in compare_emotion: {e}\n" + traceback.format_exc()
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.get("/emotion-log")
async def get_emotion_log():
    """Get emotion history (placeholder for now)"""
    return []

# Production server configuration
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )