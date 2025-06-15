
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
    # ... keep existing code (analyze_emotion) the same ...

@app.get("/")
async def root():
    # ... keep existing code (root) the same ...
