
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
    method: str = "deepface"  # Default to DeepFace, or you can use "huggingface"

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
        if payload.method == "huggingface":
            try:
                print("DEBUG: Importing transformers for HuggingFace FER+")
                from transformers import pipeline
                fe_model = pipeline("image-classification", model="nateraw/ferplus-8emotion")
                result = fe_model(img)
                print(f"DEBUG: HuggingFace FER+ result: {result}")
                # result: list of dicts [{label: 'happy', score: 0.98}, ...], already sorted
                if result:
                    best = result[0]
                    emotion = best["label"]
                    score = float(best["score"])
                    # Convert all emotion scores to a dict
                    emotion_scores = {r['label'].lower(): float(r['score'])*100 for r in result}
                    # HuggingFace FER+ does NOT provide age/gender, so return null/None
                    return {
                        "emotion": emotion,
                        "confidence": score,
                        "emotion_scores": emotion_scores,
                        "age": None,
                        "gender": None,
                    }
                else:
                    return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}, "age": None, "gender": None}
            except ImportError as e:
                error_msg = "ERROR: transformers library not installed\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                raise HTTPException(status_code=500, detail=f"HuggingFace not installed: {e}")
            except Exception as e:
                error_msg = f"ERROR: Exception in HuggingFace emotion analysis: {e}\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}, "age": None, "gender": None}
        elif payload.method == "deepface":
            try:
                print("DEBUG: Importing DeepFace")
                from deepface import DeepFace
                print("DEBUG: Running DeepFace.analyze")
                # Run demographic estimation as well
                res = DeepFace.analyze(img_path=np_img, actions=['emotion', 'age', 'gender'], enforce_detection=False)
                print(f"DEBUG: DeepFace result: {res}")
                emotion = res['dominant_emotion']
                scores_dict = res['emotion']
                score = scores_dict.get(emotion, 0.0)
                age = res.get('age', None)
                gender = res.get('gender', None)
                return {
                    "emotion": emotion,
                    "confidence": float(score)/100,
                    "emotion_scores": scores_dict,
                    "age": age,
                    "gender": gender,
                }
            except ImportError as e:
                error_msg = "ERROR: DeepFace library not installed\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                raise HTTPException(status_code=500, detail=f"DeepFace not installed: {e}")
            except Exception as e:
                error_msg = f"ERROR: Exception in DeepFace emotion analysis: {e}\n" + traceback.format_exc()
                print(error_msg)
                log_error_to_file(error_msg)
                return {"emotion": "neutral", "confidence": 0.0, "emotion_scores": {}, "age": None, "gender": None}
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
