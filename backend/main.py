from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

# --- CONFIGURATION ---
MODEL_PATH = 'animal_classifier.keras'
CLASSES_PATH = 'animal_classifier_classes.txt'
IMG_SIZE = (224, 224)

app = FastAPI()

# --- CORS (Frontend connection k liye) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL VARIABLES ---
model = None
class_names = []

# --- LOAD RESOURCES ON STARTUP ---
@app.on_event("startup")
def load_resources():
    global model, class_names
    
    # 1. Load Model
    print("Loading model...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"✓ Model loaded: {MODEL_PATH}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        # Hum yahan crash nahi karwayenge, lekin request aane par error denge

    # 2. Load Classes
    print("Loading class names...")
    if os.path.exists(CLASSES_PATH):
        try:
            with open(CLASSES_PATH, 'r') as f:
                class_names = [line.strip() for line in f.readlines()]
            print(f"✓ Classes loaded: {len(class_names)} classes found.")
        except Exception as e:
            print(f"✗ Error reading classes file: {e}")
    else:
        print("✗ Warning: Classes file not found! Predictions might show Index numbers.")

# --- HELPER FUNCTIONS ---
def preprocess_image(image_bytes):
    """Image bytes ko model input format mein convert krta hai"""
    try:
        # Bytes se image open karein
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Resize karein (Jo aapke code mein target_size tha)
        img = img.resize(IMG_SIZE)
        
        # Array banayein
        img_array = tf.keras.utils.img_to_array(img)
        
        # Batch dimension add karein (1, 224, 224, 3)
        img_array = tf.expand_dims(img_array, 0)
        
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image format")

@app.get("/")
def home():
    return {"status": "Online", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model setup failed on server.")
    
    if not class_names:
         raise HTTPException(status_code=500, detail="Class names not loaded.")

    # 1. Read File
    image_bytes = await file.read()
    
    # 2. Preprocess
    img_array = preprocess_image(image_bytes)
    
    # 3. Predict
    predictions = model.predict(img_array, verbose=0)
    
    # 4. Result Process logic (Same as your code)
    predicted_class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_class_idx] * 100) # float conversion for JSON
    
    # Top 3 Predictions nikalna
    top_3_idx = np.argsort(predictions[0])[-3:][::-1]
    
    top_predictions = []
    for idx in top_3_idx:
        top_predictions.append({
            "animal": class_names[idx],
            "probability": f"{predictions[0][idx]*100:.2f}%"
        })

    # 5. Return JSON Response
    return {
        "predicted_class": class_names[predicted_class_idx],
        "confidence": f"{confidence:.2f}%",
        "top_3_predictions": top_predictions
    }