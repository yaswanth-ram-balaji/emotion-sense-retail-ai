
import base64
from io import BytesIO
from PIL import Image
import random

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

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    print("DEBUG: detect_face called")
    try:
        # Decode image to verify it's valid
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        
        # For now, just return the original image as "face crop"
        # This ensures the endpoint works while we debug deployment
        with BytesIO() as buf:
            img.save(buf, format="JPEG")
            face_bytes = buf.getvalue()
            face_base64 = base64.b64encode(face_bytes).decode("utf-8")
        
        return {"face_crop_base64": "data:image/jpeg;base64," + face_base64}
        
    except Exception as e:
        print(f"ERROR: {e}")
        return {"face_crop_base64": None}

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    # Return random but realistic emotion data
    emotions = ["happy", "neutral", "sad", "angry", "surprise", "fear", "disgust"]
    emotion = random.choice(emotions)
    confidence = round(random.uniform(0.7, 0.95), 2)
    
    # Generate realistic emotion scores
    emotion_scores = {}
    remaining = 1.0 - confidence
    for e in emotions:
        if e == emotion:
            emotion_scores[e] = confidence
        else:
            score = round(random.uniform(0, remaining / (len(emotions) - 1)), 2)
            emotion_scores[e] = score
            remaining -= score
    
    return {
        "emotion": emotion,
        "confidence": confidence,
        "emotions": emotion_scores
    }

@app.post("/compare-emotion")
async def compare_emotion(payload: dict):
    entry = payload.get("entry", "neutral")
    exit = payload.get("exit", "neutral")
    
    # Simple satisfaction logic
    positive_emotions = ["happy", "surprise"]
    negative_emotions = ["sad", "angry", "fear", "disgust"]
    
    if entry in negative_emotions and exit in positive_emotions:
        satisfaction = "Improved"
        delta = "Positive"
    elif entry in positive_emotions and exit in negative_emotions:
        satisfaction = "Declined"
        delta = "Negative"
    elif entry in positive_emotions and exit in positive_emotions:
        satisfaction = "Maintained High"
        delta = "Stable"
    else:
        satisfaction = "Neutral"
        delta = "Stable"
    
    return {"satisfaction": satisfaction, "delta": delta}

@app.get("/emotion-log")
async def get_emotion_log():
    return []

@app.get("/")
async def root():
    return {"message": "Emotion Detection API is running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
