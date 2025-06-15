
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import base64
from io import BytesIO
from PIL import Image
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict to your frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageInput(BaseModel):
    image_base64: str
    method: str = "fer"  # Default is FER, or you can use "deepface"

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    """
    Demo implementation: This just verifies and returns the original face as base64.
    Replace with real face detection logic as needed.
    """
    try:
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        # Fake detection: just return the original cropped image for demo
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        face_crop_base64 = base64.b64encode(buffered.getvalue()).decode()
        return {"face_crop_base64": face_crop_base64}
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to process image for face detection")

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    try:
        imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
        img = Image.open(BytesIO(imgdata)).convert("RGB")
        np_img = np.array(img)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")

    if payload.method == "fer":
        try:
            from fer import FER
            detector = FER(mtcnn=True)
            result = detector.detect_emotions(np_img)
            if result:
                emotions_dict = result[0]["emotions"]
                emotion = max(emotions_dict, key=emotions_dict.get)
                score = float(emotions_dict[emotion])
                return {"emotion": emotion, "confidence": score}
            else:
                return {"emotion": "neutral", "confidence": 0.0}
        except ImportError:
            raise HTTPException(status_code=500, detail="FER not installed")
    elif payload.method == "deepface":
        try:
            from deepface import DeepFace
            res = DeepFace.analyze(img_path=np_img, actions=['emotion'], enforce_detection=False)
            emotion = res['dominant_emotion']
            score = float(res["emotion"][emotion]) / 100
            return {"emotion": emotion, "confidence": score}
        except ImportError:
            raise HTTPException(status_code=500, detail="DeepFace not installed")
        except Exception:
            return {"emotion": "neutral", "confidence": 0.0}
    else:
        raise HTTPException(status_code=400, detail="Invalid method")

@app.get("/")
async def root():
    return {"message": "Welcome to the Emotion Analysis API. Use /analyze_emotion to analyze emotions from images."}
