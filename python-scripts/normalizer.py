import sys
import json
import dateparser
from datetime import datetime, timedelta
import pytz
import re

WEEKDAYS = {
    "monday": 0, "tuesday": 1, "wednesday": 2,
    "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6
}

def parse_date_phrase(date_phrase):
    if not date_phrase:
        return None

    text = date_phrase.lower().strip()

    # Handle "next <weekday>"
    if text.startswith("next "):
        weekday_name = text.split("next ")[1].strip()
        if weekday_name in WEEKDAYS:
            today = datetime.now()
            today_wd = today.weekday()
            target_wd = WEEKDAYS[weekday_name]

            # Days until next target weekday
            days_ahead = (target_wd - today_wd + 7) % 7
            if days_ahead == 0:
                days_ahead = 7
            return today + timedelta(days=days_ahead)

    # Fallback to dateparser
    return dateparser.parse(date_phrase)

def parse_time_phrase(time_phrase):
    if not time_phrase:
        return None

    # Simple regex for hh(am/pm)
    match = re.match(r"(\d{1,2})(?:[:](\d{2}))?\s*(am|pm)?", time_phrase.lower())
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2) or 0)
        meridian = match.group(3)

        if meridian == "pm" and hour != 12:
            hour += 12
        if meridian == "am" and hour == 12:
            hour = 0
        return datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)

    # fallback to dateparser
    return dateparser.parse(time_phrase)


def normalize_entities(entities, tz="Asia/Kolkata"):
    result = {
        "normalized": {
            "date": None,
            "time": None,
            "tz": tz
        },
        "normalization_confidence": 0.0
    }

    date_phrase = entities.get("date_phrase", "")
    time_phrase = entities.get("time_phrase", "")

    parsed_date = parse_date_phrase(date_phrase)
    parsed_time = parse_time_phrase(time_phrase)

    if not parsed_date or not parsed_time:
        return {"status": "needs_clarification", "message": "Ambiguous date/time or department"}

    # Combine date + time
    combined = parsed_date.replace(hour=parsed_time.hour, minute=parsed_time.minute)

    tzinfo = pytz.timezone(tz)
    combined = tzinfo.localize(combined)

    result["normalized"]["date"] = combined.strftime("%Y-%m-%d")
    result["normalized"]["time"] = combined.strftime("%H:%M")
    result["normalization_confidence"] = 0.90

    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python normalizer.py '<entities-json>'"}))
        sys.exit(1)

    try:
        entities = json.loads(sys.argv[1])
        result = normalize_entities(entities)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
