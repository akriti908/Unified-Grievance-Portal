# from datetime import datetime
# import sys
# import json

# _registered = []

# def is_duplicate(description: str, name: str = "", state: str = "", 
#                  district: str = "", pincode: str = "") -> dict:
#     for entry in _registered:
#         desc_match = description.lower().strip() == entry["description"].lower().strip()
#         name_match = name.lower().strip() == entry["name"].lower().strip()
#         state_match = state.lower().strip() == entry["state"].lower().strip()
#         district_match = district.lower().strip() == entry["district"].lower().strip()
#         pincode_match = pincode.strip() == entry["pincode"].strip()

#         if desc_match and name_match and state_match and district_match and pincode_match:
#             return {
#                 "is_duplicate": True,
#                 "matched_with": entry["tracking_id"],
#                 "similarity_score": 100.0,
#                 "original_submitted_at": entry["submitted_at"]
#             }
#     return {"is_duplicate": False}

# def register_grievance(description: str, tracking_id: str, name: str = "",
#                        state: str = "", district: str = "", pincode: str = ""):
#     _registered.append({
#         "description": description,
#         "tracking_id": tracking_id,
#         "name": name,
#         "state": state,
#         "district": district,
#         "pincode": pincode,
#         "submitted_at": str(datetime.now())
#     })
    
# if __name__ == "__main__":
#     action = sys.argv[1] if len(sys.argv) > 1 else ""

#     if action == "check":
#         description = sys.argv[2] if len(sys.argv) > 2 else ""
#         result = is_duplicate(description)
#         print(json.dumps(result))

#     elif action == "register":
#         description = sys.argv[2] if len(sys.argv) > 2 else ""
#         tracking_id = sys.argv[3] if len(sys.argv) > 3 else ""
#         register_grievance(description, tracking_id)
#         print("registered")

from datetime import datetime
import sys
import json
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "duplicate_data.json")

# 🔹 LOAD DATA
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return []

# 🔹 SAVE DATA
def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

_registered = load_data()

# 🔹 CHECK DUPLICATE
def is_duplicate(description: str, name: str = "", state: str = "", 
                 district: str = "", pincode: str = "") -> dict:
    for entry in _registered:
        if description.lower().strip() == entry["description"].lower().strip():
            return {
                "is_duplicate": True,
                "matched_with": entry["tracking_id"],
                "similarity_score": 100.0,
                "original_submitted_at": entry["submitted_at"]
            }
    return {"is_duplicate": False}

# 🔹 REGISTER
def register_grievance(description: str, tracking_id: str):
    _registered.append({
        "description": description,
        "tracking_id": tracking_id,
        "submitted_at": str(datetime.now())
    })
    save_data(_registered)

# 🔹 CLI
if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else ""

    if action == "check":
        description = sys.argv[2] if len(sys.argv) > 2 else ""
        result = is_duplicate(description)
        print(json.dumps(result))

    elif action == "register":
        description = sys.argv[2] if len(sys.argv) > 2 else ""
        tracking_id = sys.argv[3] if len(sys.argv) > 3 else ""
        register_grievance(description, tracking_id)
        print("registered")