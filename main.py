
import base64
from io import BytesIO
from PIL import Image
import random
import traceback

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Emotion Detection API", version="1.0.0")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageInput(BaseModel):
    image_base64: str
    method: str = "fer"

@app.get("/")
async def root():
    print("INFO: Root endpoint called")
    return {"message": "Emotion Detection API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    print("INFO: Health check endpoint called")
    return {"status": "healthy", "message": "Backend is connected and running"}

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    print("INFO: detect_face endpoint called")
    try:
        # Decode and validate image
        image_data = payload.image_base64
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        print(f"INFO: Processing image data of length: {len(image_data)}")
        
        # Decode base64 image
        imgdata = base64.b64decode(image_data)
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        
        print(f"INFO: Image loaded successfully, size: {img.size}")
        
        # For local testing, return the original image as face crop
        # In a real implementation, this would use face detection
        with BytesIO() as buf:
            img.save(buf, format="JPEG", quality=85)
            face_bytes = buf.getvalue()
            face_base64 = base64.b64encode(face_bytes).decode("utf-8")
        
        print("INFO: Face detection completed successfully")
        return {"face_crop_base64": face_base64}
        
    except Exception as e:
        print(f"ERROR: Face detection failed: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Face detection failed: {str(e)}")

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    print("INFO: analyze_emotion endpoint called")
    try:
        # Validate image data
        image_data = payload.image_base64
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode to verify it's valid
        imgdata = base64.b64decode(image_data)
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        
        print(f"INFO: Analyzing emotion for image size: {img.size}")
        
        # Generate realistic emotion data for local testing
        emotions = ["happy", "neutral", "sad", "angry", "surprise", "fear", "disgust"]
        primary_emotion = random.choice(emotions)
        primary_confidence = round(random.uniform(0.65, 0.95), 2)
        
        # Generate emotion scores that sum to 1.0
        emotion_scores = {}
        remaining_confidence = 1.0 - primary_confidence
        
        for emotion in emotions:
            if emotion == primary_emotion:
                emotion_scores[emotion] = primary_confidence
            else:
                if remaining_confidence > 0:
                    score = round(random.uniform(0, remaining_confidence / (len(emotions) - 1)), 2)
                    emotion_scores[emotion] = min(score, remaining_confidence)
                    remaining_confidence -= emotion_scores[emotion]
                else:
                    emotion_scores[emotion] = 0.0
        
        # Ensure scores sum to 1.0
        total = sum(emotion_scores.values())
        if total > 0:
            emotion_scores = {k: round(v/total, 2) for k, v in emotion_scores.items()}
        
        result = {
            "emotion": primary_emotion,
            "confidence": primary_confidence,
            "emotion_scores": emotion_scores
        }
        
        print(f"INFO: Emotion analysis result: {primary_emotion} ({primary_confidence})")
        return result
        
    except Exception as e:
        print(f"ERROR: Emotion analysis failed: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Emotion analysis failed: {str(e)}")

@app.post("/compare-emotion")
async def compare_emotion(payload: dict):
    print("INFO: compare_emotion endpoint called")
    try:
        entry_emotion = payload.get("entry", "neutral")
        exit_emotion = payload.get("exit", "neutral")
        
        print(f"INFO: Comparing emotions - Entry: {entry_emotion}, Exit: {exit_emotion}")
        
        # Define emotion categories
        positive_emotions = ["happy", "surprise"]
        negative_emotions = ["sad", "angry", "fear", "disgust"]
        
        # Determine satisfaction based on emotion transition
        if entry_emotion in negative_emotions and exit_emotion in positive_emotions:
            satisfaction = "Improved"
            delta = "Positive"
        elif entry_emotion in positive_emotions and exit_emotion in negative_emotions:
            satisfaction = "Declined"
            delta = "Negative"
        elif entry_emotion in positive_emotions and exit_emotion in positive_emotions:
            satisfaction = "Maintained High"
            delta = "Stable"
        elif entry_emotion in negative_emotions and exit_emotion in negative_emotions:
            satisfaction = "Maintained Low"
            delta = "Stable"
        else:
            satisfaction = "Neutral"
            delta = "Stable"
        
        result = {"satisfaction": satisfaction, "delta": delta}
        print(f"INFO: Satisfaction result: {result}")
        return result
        
    except Exception as e:
        print(f"ERROR: Emotion comparison failed: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Emotion comparison failed: {str(e)}")

@app.get("/emotion-log")
async def get_emotion_log():
    print("INFO: emotion_log endpoint called")
    try:
        # For local testing, return empty array
        # In production, this would fetch from database
        return []
    except Exception as e:
        print(f"ERROR: Failed to get emotion log: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get emotion log: {str(e)}")

# Add a catch-all handler to debug missing endpoints
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def catch_all(path: str):
    print(f"WARNING: Unhandled request to path: /{path}")
    raise HTTPException(status_code=404, detail=f"Endpoint /{path} not found")

if __name__ == "__main__":
    import uvicorn
    print("Starting Emotion Detection API on http://localhost:8000")
    print("Available endpoints:")
    print("  GET  /          - Root endpoint")
    print("  GET  /health    - Health check")
    print("  POST /detect-face - Face detection")
    print("  POST /analyze_emotion - Emotion analysis")
    print("  POST /compare-emotion - Emotion comparison")
    print("  GET  /emotion-log - Get emotion history")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
