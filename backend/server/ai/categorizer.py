# 🤖 AI MODEL: Categorizes grievance into domains (Sanitation, Emergency, etc.)
import json
import re
import pandas as pd
import joblib
import os
import sys
import warnings

warnings.filterwarnings("ignore")

# 🔇 Disable all prints
def silent_print(*args, **kwargs):
    pass

# ─────────────────────────────────────────
# NLP Setup
# ─────────────────────────────────────────
try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    from nltk.tokenize import word_tokenize

    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('omw-1.4', quiet=True)

    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    NLP_ENABLED = True

except:
    NLP_ENABLED = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, 'saved_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'saved_vectorizer.pkl')

# ─────────────────────────────────────────
# CLEAN TEXT
# ─────────────────────────────────────────
def clean_text(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    if NLP_ENABLED:
        try:
            tokens = word_tokenize(text)
            tokens = [
                lemmatizer.lemmatize(token)
                for token in tokens
                if token not in stop_words and len(token) > 2
            ]
            return ' '.join(tokens)
        except:
            pass
    return text


# ─────────────────────────────────────────
# LOAD OR TRAIN MODEL
# ─────────────────────────────────────────
if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)

else:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.naive_bayes import MultinomialNB
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import LinearSVC
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score

    USE_REAL_DATA = False

    try:
        grievance_path = os.path.join(BASE_DIR, 'no_pii_grievance.json')
        category_path = os.path.join(BASE_DIR, 'CategoryCode_Mapping.xlsx')

        with open(grievance_path, 'r', encoding='utf-8') as f:
            grievances_data = json.load(f)

        category_mapping = pd.read_excel(category_path)
        df = pd.DataFrame(grievances_data)

        df['combined_text'] = (
            df['remarks_text'].fillna('') + ' ' +
            df['subject_content_text'].fillna('')
        )

        cat_map = dict(zip(
            category_mapping['Code'].astype(str).str.split('.').str[0],
            category_mapping['Description']
        ))

        df['cat_key'] = df['CategoryV7'].apply(
            lambda x: str(int(float(x))) if pd.notna(x) else None
        )

        df['category_name'] = df['cat_key'].map(cat_map)

        df = df.dropna(subset=['category_name'])
        df = df[df['combined_text'].str.len() > 20]

        texts = df['combined_text'].tolist()
        labels = df['category_name'].tolist()

        USE_REAL_DATA = True

    except:
        # fallback dataset
        texts = [
            "pothole on road",
            "street light not working",
            "no water supply",
            "garbage not collected",
            "hospital not providing medicine",
            "school building damaged"
        ]

        labels = [
            "Infrastructure",
            "Electricity",
            "Water",
            "Sanitation",
            "Health",
            "Education"
        ]

    cleaned_texts = [clean_text(t) for t in texts]

    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    X = vectorizer.fit_transform(cleaned_texts)
    y = labels

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        "nb": MultinomialNB(),
        "lr": LogisticRegression(max_iter=1000),
        "rf": RandomForestClassifier(),
        "svm": LinearSVC()
    }

    best_model = None
    best_acc = 0

    for m in models.values():
        m.fit(X_train, y_train)
        acc = accuracy_score(y_test, m.predict(X_test))
        if acc > best_acc:
            best_acc = acc
            best_model = m

    model = best_model

    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)


# ─────────────────────────────────────────
# PREDICTION FUNCTION
# ─────────────────────────────────────────
# def categorize_grievance(text: str) -> str:
#     cleaned = clean_text(text)
#     if not cleaned.strip():
#         return "General"

#     X_input = vectorizer.transform([cleaned])
#     prediction = model.predict(X_input)
#     return str(prediction[0])

def categorize_grievance(text: str) -> str:
    if not text:
        return "General"

    text_lower = text.lower()

    # 🚨 EMERGENCY RULES (HIGH PRIORITY)
    emergency_keywords = [
        "accident", "crash", "injury", "death", "fire",
        "explosion", "gas leak", "emergency", "collapse",
        "flood", "danger", "ambulance"
    ]

    if any(word in text_lower for word in emergency_keywords):
        return "Emergency"

    # 🤖 ML MODEL (normal cases)
    cleaned = clean_text(text)
    if not cleaned.strip():
        return "General"

    X_input = vectorizer.transform([cleaned])
    prediction = model.predict(X_input)

    return str(prediction[0])

# ─────────────────────────────────────────
# CLI (FOR NODE.JS)
# ─────────────────────────────────────────
if __name__ == "__main__":
    text = sys.argv[1] if len(sys.argv) > 1 else ""
    result = categorize_grievance(text)

    print(result)   # ✅ ONLY OUTPUT