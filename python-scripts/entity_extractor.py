import sys
import json
import re

def extract_entities(text):
    result = {
        "entities": {
            "date_phrase": "",
            "time_phrase": "",
            "department": ""
        },
        "entities_confidence": 0.0
    }

    text_lower = text.lower()

    # Extract department
    departments = ["dentist","doctor","cardiologist","dermatologist","orthopedic","neurologist","gynecologist","pediatrician","ophthalmologist"]

    for dept in departments:
        if dept in text_lower:
            result["entities"]["department"] = dept
            break

    # Extract time phrase (regex for times like 3pm, 10:30 am, 14:00)
    time_match = re.search(r'\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b', text_lower)
    if time_match:
        result["entities"]["time_phrase"] = time_match.group(1)

    # Extract date phrase
    date_keywords = ["today", "tomorrow", "next monday", "next tuesday", "next wednesday",
                     "next thursday", "next friday", "next saturday", "next sunday"]
    for dk in date_keywords:
        if dk in text_lower:
            result["entities"]["date_phrase"] = dk
            break

    # Compute confidence
    found = sum(1 for v in result["entities"].values() if v)
    result["entities_confidence"] = round(found / 3, 2)

    return result

# ---------------- Main block for Node.js ----------------
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("Usage: python entity_extractor.py '<text>'")

        # Join all argv elements to allow spaces in input
        input_text = " ".join(sys.argv[1:])
        output = extract_entities(input_text)
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({
            "entities": {},
            "entities_confidence": 0.0,
            "error": str(e)
        }))
