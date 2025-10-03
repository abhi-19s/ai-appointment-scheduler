import sys
import json

def create_final_appointment(entities, normalized):
    """
    Combine entities and normalized datetime into final appointment JSON
    """
    # If normalization failed
    if "status" in normalized and normalized["status"] == "needs_clarification":
        return normalized

    # Map department name capitalization
    dept = entities.get("department", "")
    dept = dept.capitalize() if dept else ""

    final = {
        "appointment": {
            "department": dept,
            "date": normalized["normalized"]["date"],
            "time": normalized["normalized"]["time"],
            "tz": normalized["normalized"]["tz"]
        },
        "status": "ok"
    }

    return final


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python final_appointment.py '<entities-json>' '<normalized-json>'"}))
        sys.exit(1)

    try:
        entities = json.loads(sys.argv[1])
        normalized = json.loads(sys.argv[2])

        final_result = create_final_appointment(entities, normalized)
        print(json.dumps(final_result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
