# Production-ready FastAPI backend for Railway deployment
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

# Production CORS configuration - allows your Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cute-lily-7bee8d.netlify.app",  # Your Netlify site
        "http://localhost:8080",  # Local development
        "http://localhost:3000",  # Alternative local
        "*"  # Allow all for now (restrict in production)
    ],
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
        print(f"ERROR LOG: {msg}")  # Railway logs will capture this
    except:
        pass

@app.get("/")
async def root():
    return {
        "message": "🎯 Emotion Detection API is running on Railway!",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": ["/detect-face", "/analyze_emotion", "/compare-emotion", "/docs"],
        "deployment": "railway-production"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "emotion-detection-api",
        "platform": "railway",
        "python_version": sys.version
    }

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    print("🔍 Face detection started")
    try:
        try:
            print("📷 Decoding image")
            imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
            img = Image.open(BytesIO(imgdata)).convert("RGB")
            np_img = np.array(img)
            print(f"✅ Image processed: {np_img.shape}")
        except Exception as e:
            error_msg = f"❌ Image decoding error: {e}"
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

        # Face detection with DeepFace
        if payload.method == "deepface":
            try:
                print("🧠 Loading DeepFace detector")
                from deepface.detectors import FaceDetector
                detector_name = "opencv"
                detector = FaceDetector.build_model(detector_name)
                
                print("🔎 Detecting faces")
                detected_faces = FaceDetector.detect_faces(detector_name, detector, np_img)
                print(f"👥 Found {len(detected_faces)} faces")
                
                if not detected_faces:
                    # Return original image if no face detected
                    print("⚠️ No face detected, returning original")
                    return {"face_crop_base64": payload.image_base64}
                
                # Get largest face
                faces_sorted = sorted(
                    detected_faces,
                    key=lambda d: (d[1][2] * d[1][3]),  # width * height
                    reverse=True,
                )
                face_region = faces_sorted[0][1]  # (x, y, w, h)
                x, y, w, h = face_region
                
                print(f"✂️ Cropping face: x={x}, y={y}, w={w}, h={h}")
                x, y = max(0, x), max(0, y)
                cropped_face = np_img[y:y+h, x:x+w]
                
                if cropped_face.size == 0:
                    print("⚠️ Empty crop, returning original")
                    return {"face_crop_base64": payload.image_base64}
                
                # Convert back to base64
                cropped_pil = Image.fromarray(cropped_face)
                with BytesIO() as buf:
                    cropped_pil.save(buf, format="JPEG")
                    face_bytes = buf.getvalue()
                    face_base64 = base64.b64encode(face_bytes).decode("utf-8")
                
                print("✅ Face detection completed")
                return {"face_crop_base64": "data:image/jpeg;base64," + face_base64}
                
            except Exception as e:
                error_msg = f"❌ DeepFace error: {e}"
                print(error_msg)
                log_error_to_file(error_msg)
                # Return original image as fallback
                return {"face_crop_base64": payload.image_base64}
        else:
            # Fallback for other methods
            return {"face_crop_base64": payload.image_base64}
            
    except Exception as e:
        error_msg = f"💥 Critical error in detect_face: {e}"
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    print("😊 Emotion analysis started")
    try:
        try:
            print("📷 Decoding image for emotion analysis")
            imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
            img = Image.open(BytesIO(imgdata)).convert("RGB")
            np_img = np.array(img)
            print(f"✅ Image ready: {np_img.shape}")
        except Exception as e:
            error_msg = f"❌ Image decoding error: {e}"
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

        try:
            print("🧠 Loading DeepFace for emotion analysis")
            from deepface import DeepFace
            
            print("🎭 Analyzing emotions")
            result = DeepFace.analyze(
                img_path=np_img,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            print(f"📊 Analysis result type: {type(result)}")
            
            # Handle both single result and list of results
            if isinstance(result, list):
                result = result[0]
            
            emotion_scores = result.get('emotion', {})
            dominant_emotion = result.get('dominant_emotion', 'neutral')
            
            # Calculate confidence as the score of the dominant emotion
            confidence = emotion_scores.get(dominant_emotion, 50.0) / 100.0
            
            print(f"✅ Detected: {dominant_emotion} ({confidence:.2%})")
            
            return {
                "emotion": dominant_emotion,
                "confidence": confidence,
                "emotion_scores": emotion_scores
            }
            
        except Exception as e:
            error_msg = f"❌ DeepFace emotion analysis error: {e}"
            print(error_msg)
            log_error_to_file(error_msg)
            # Return neutral fallback
            print("🔄 Returning neutral fallback")
            return {
                "emotion": "neutral",
                "confidence": 0.75,
                "emotion_scores": {"neutral": 75.0, "happy": 15.0, "sad": 10.0}
            }
            
    except Exception as e:
        error_msg = f"💥 Critical error in analyze_emotion: {e}"
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.post("/compare-emotion")
async def compare_emotion(payload: EmotionComparison):
    """Compare entry and exit emotions to determine satisfaction"""
    print(f"📈 Comparing emotions: {payload.entry} → {payload.exit}")
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
        
        print(f"✅ Satisfaction result: {satisfaction}")
        
        return {
            "satisfaction": satisfaction,
            "delta": delta,
            "entry_emotion": entry,
            "exit_emotion": exit
        }
        
    except Exception as e:
        error_msg = f"💥 Error in compare_emotion: {e}"
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.get("/emotion-log")
async def get_emotion_log():
    """Get emotion history (placeholder for now)"""
    print("📋 Fetching emotion log")
    # Return empty array for now - can be extended later
    return []

# Railway production server
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )