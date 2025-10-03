import sys
import json
from PIL import Image
import pytesseract

# Set path to Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_input(input_data, input_type="text"):

    result = {
        "raw_text": "",
        "confidence": 0.0
    }

    if input_type == "text":
        result["raw_text"] = input_data
        result["confidence"] = 1.0  # Direct text assumed correct 

    elif input_type == "image":
        try:
            img = Image.open(input_data)
            ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

            # Join all non-empty words
            raw_text = " ".join([w for w in ocr_data["text"] if w.strip() != ""]).strip()
            result["raw_text"] = raw_text

            # Compute average confidence (ignore -1 values)
            confs = [float(c) for c in ocr_data["conf"] if c != "-1"]
            if confs:
                avg_conf = sum(confs) / len(confs)
                result["confidence"] = round(avg_conf / 100, 2)
            else:
                result["confidence"] = 0.0

        except Exception as e:
            result["raw_text"] = ""
            result["confidence"] = 0.0
            result["error"] = f"Failed to process image: {str(e)}"

    else:
        result["error"] = f"Invalid input_type: {input_type}"

    return result

# ---------------- Main block for Node.js integration ----------------
if __name__ == "__main__":
    try:
        input_data = sys.argv[1] if len(sys.argv) > 1 else ""
        input_type = sys.argv[2] if len(sys.argv) > 2 else "text"

        output = extract_text_from_input(input_data, input_type)
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({
            "raw_text": "",
            "confidence": 0.0,
            "error": f"Unexpected error: {str(e)}"
        }))
