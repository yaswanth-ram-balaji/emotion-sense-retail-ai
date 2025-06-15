
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import traceback
import sys

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
    method: str = "fer"  # Default is FER, or you can use "deepface"

def log_error_to_file(msg):
    with open("backend_errors.log", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    # ... keep existing code (detect_face) the same ...

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    print("DEBUG: analyze_emotion called")
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

        print(f"DEBUG: Analysis method = {payload.method}")
        if payload.method == "fer":
            try:
                print("DEBUG: Importing FER")
                from fer import FER
                print("DEBUG: Creating FER detector")
                detector = FER(mtcnn=True)
                print("DEBUG: Running detect_emotions")
                result = detector.detect_emotions(np_img)
                print(f"DEBUG: FER result: {result}")
                if result:
                    emotions_dict = result[0]["emotions"]
                    print(f"DEBUG: FER emotions dict: {emotions_dict}")
                    emotion = max(emotions_dict, key=emotions_dict.get)
                    score = float(emotions_dict[emotion])
                    # Return all scores as percent (0-100)
                    percent_scores = {em: float(emotions_dict[em]) * 100 if float(emotions_dict[em]) <= 1.0 else float(emotions_dict[em]) for em in emotions_dict}
                    return {"emotion": emotion, "confidence": score, "emotion_scores": percent_scores}
                else:
                    print("DEBUG: No emotions detected, defaulting to neutral")
                    return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}}
            except ImportError as e:
                error_msg = "ERROR: FER library not installed\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                raise HTTPException(status_code=500, detail=f"FER not installed: {e}")
            except Exception as e:
                error_msg = f"ERROR: Exception in FER emotion analysis: {e}\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}}
        elif payload.method == "deepface":
            try:
                print("DEBUG: Importing DeepFace")
                from deepface import DeepFace
                print("DEBUG: Running DeepFace.analyze")
                res = DeepFace.analyze(img_path=np_img, actions=['emotion'], enforce_detection=False)
                print(f"DEBUG: DeepFace result: {res}")
                emotion = res['dominant_emotion']
                # DeepFace emotion dict: already in 0-100 percent
                scores_dict = res['emotion']
                score = scores_dict.get(emotion, 0.0)
                return {"emotion": emotion, "confidence": float(score)/100, "emotion_scores": scores_dict}
            except ImportError as e:
                error_msg = "ERROR: DeepFace library not installed\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                raise HTTPException(status_code=500, detail=f"DeepFace not installed: {e}")
            except Exception as e:
                error_msg = f"ERROR: Exception in DeepFace emotion analysis: {e}\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}}
        else:
            error_msg = f"ERROR: Invalid method specified\n"
            print(error_msg)
            log_error_to_file(error_msg)
            raise HTTPException(status_code=400, detail=f"Invalid method: {payload.method}")
    except Exception as e:
        error_msg = f"CRITICAL: Uncaught exception in analyze_emotion: {e}\n" + traceback.format_exc()
        print(error_msg)
        log_error_to_file(error_msg)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.get("/")
async def root():
    # ... keep existing code (root) the same ...

