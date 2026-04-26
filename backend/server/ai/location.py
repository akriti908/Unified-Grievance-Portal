# 📍 AI MODEL: Maps grievance to department/location authority
STATE_OFFICES = {
    "andhra pradesh": {
        "office": "AP Grievance Redressal Cell, Amaravati",
        "helpline": "1800-425-0082"
    },
    "telangana": {
        "office": "Telangana State Grievance Cell, Hyderabad",
        "helpline": "1800-425-0801"
    },
    "maharashtra": {
        "office": "Maharashtra Grievance Cell, Mumbai",
        "helpline": "1800-222-080"
    },
    "delhi": {
        "office": "Delhi Grievance Redressal Cell, New Delhi",
        "helpline": "1800-11-0031"
    },
    "karnataka": {
        "office": "Karnataka Grievance Cell, Bengaluru",
        "helpline": "1800-425-9339"
    },
    "tamil nadu": {
        "office": "Tamil Nadu Grievance Cell, Chennai",
        "helpline": "1800-425-1188"
    },
    "uttar pradesh": {
        "office": "UP Grievance Cell, Lucknow",
        "helpline": "1800-180-5145"
    },
    "gujarat": {
        "office": "Gujarat Grievance Cell, Gandhinagar",
        "helpline": "1800-233-1100"
    },
    "rajasthan": {
        "office": "Rajasthan Grievance Cell, Jaipur",
        "helpline": "1800-180-6127"
    },
    "west bengal": {
        "office": "West Bengal Grievance Cell, Kolkata",
        "helpline": "1800-345-5505"
    },
    "kerala": {
        "office": "Kerala Grievance Cell, Thiruvananthapuram",
        "helpline": "1800-425-1550"
    },
    "punjab": {
        "office": "Punjab Grievance Cell, Chandigarh",
        "helpline": "1800-180-2222"
    },
    "madhya pradesh": {
        "office": "MP Grievance Cell, Bhopal",
        "helpline": "1800-233-3800"
    },
    "bihar": {
        "office": "Bihar Grievance Cell, Patna",
        "helpline": "1800-345-6188"
    },
    "odisha": {
        "office": "Odisha Grievance Cell, Bhubaneswar",
        "helpline": "1800-345-6770"
    },
}

CATEGORY_DEPARTMENT = {
    "Infrastructure": "Public Works Department (PWD)",
    "Water": "Water Supply & Sanitation Department",
    "Electricity": "State Electricity Board",
    "Sanitation": "Municipal Corporation / Swachh Bharat Mission",
    "Health": "State Health Department",
    "Education": "State Education Department",
}

def get_location_info(state: str = None, district: str = None,
                      pincode: str = None, category: str = None) -> dict:

    result = {
        "nearest_office": "Central Grievance Cell, New Delhi (Default)",
        "responsible_department": "District Collectorate",
        "state_helpline": "1800-11-0031",
        "location_verified": False
    }

    if state:
        state_lower = state.lower().strip()
        if state_lower in STATE_OFFICES:
            info = STATE_OFFICES[state_lower]
            result["nearest_office"] = info["office"]
            result["state_helpline"] = info["helpline"]
            result["location_verified"] = True

            if district:
                result["nearest_office"] = (
                    f"{district.title()} District Office "
                    f"(Under {info['office']})"
                )

    if category and category in CATEGORY_DEPARTMENT:
        result["responsible_department"] = CATEGORY_DEPARTMENT[category]

    if pincode:
        result["pincode_area"] = f"Area under Pincode {pincode}"

    return result