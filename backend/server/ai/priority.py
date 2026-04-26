# ⚡ AI MODEL: Assigns priority level based on severity of text
import sys

def get_priority(description: str) -> dict:
    text = description.lower()

    high_keywords = [
        "urgent", "emergency", "fire", "death", "critical",
        "accident", "gas leak", "explosion", "missing",
        "flood", "collapse", "danger", "water contamination", "water clogged"
    ]

    medium_keywords = [
        "broken", "damaged", "severe", "electricity",
        "blocked", "not working", "leakage", "issue",
        "complaint", "delay"
    ]

    if any(word in text for word in high_keywords):
        return {
            "priority": "High",
            "action_required_within": "24 hours"
        }

    elif any(word in text for word in medium_keywords):
        return {
            "priority": "Medium",
            "action_required_within": "72 hours"
        }

    return {
        "priority": "Low",
        "action_required_within": "7 days"
    }


# ✅ CLI support for Node.js bridge
if __name__ == "__main__":
    input_text = sys.argv[1] if len(sys.argv) > 1 else ""
    result = get_priority(input_text)

    # Print BOTH values (important for JS)
    print(result["priority"] + "|" + result["action_required_within"])