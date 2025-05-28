from fastapi import FastAPI, File, UploadFile
import easyocr
import shutil
import os
from PIL import Image, ImageEnhance, ImageFilter

app = FastAPI()
reader = easyocr.Reader(['ro', 'en'])


def preprocess_image(image_path):
    img = Image.open(image_path).convert("L")
    img = img.filter(ImageFilter.SHARPEN)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    preprocessed_path = f"preprocessed_{os.path.basename(image_path)}"
    img.save(preprocessed_path)
    return preprocessed_path


@app.post("/ocr")
async def extract_text(photo: UploadFile = File(...)):
    temp_path = f"temp_{photo.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    preprocessed_path = preprocess_image(temp_path)

    result = reader.readtext(preprocessed_path, detail=0, paragraph=True)

    os.remove(temp_path)
    os.remove(preprocessed_path)

    return {"text": "\n".join(result)}
