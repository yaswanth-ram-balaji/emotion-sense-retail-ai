
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import traceback

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

@app.post("/detect-face")
async def detect_face(payload: ImageInput):
    # ... keep existing code (detect_face) the same ...

@app.post("/analyze_emotion")
async def analyze_emotion(payload: ImageInput):
    try:
        try:
            imgdata = base64.b64decode(payload.image_base64.split(",")[-1])
            img = Image.open(BytesIO(imgdata)).convert("RGB")
            np_img = np.array(img)
        except Exception as e:
            print("Error decoding or opening the image")
            traceback.print_exc()
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
                print("FER library not installed")
                traceback.print_exc()
                raise HTTPException(status_code=500, detail="FER not installed")
            except Exception as e:
                print(f"Exception in FER emotion analysis: {e}")
                traceback.print_exc()
                return {"emotion": "neutral", "confidence": 0.0}
        elif payload.method == "deepface":
            try:
                from deepface import DeepFace
                res = DeepFace.analyze(img_path=np_img, actions=['emotion'], enforce_detection=False)
                emotion = res['dominant_emotion']
                score = float(res["emotion"][emotion]) / 100
                return {"emotion": emotion, "confidence": score}
            except ImportError:
                print("DeepFace library not installed")
                traceback.print_exc()
                raise HTTPException(status_code=500, detail="DeepFace not installed")
            except Exception as e:
                print(f"Exception in DeepFace emotion analysis: {e}")
                traceback.print_exc()
                return {"emotion": "neutral", "confidence": 0.0}
        else:
            raise HTTPException(status_code=400, detail="Invalid method")
    except Exception as e:
        print(f"Uncaught exception in analyze_emotion: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@app.get("/")
async def root():
    # ... keep existing code (root) the same ...
