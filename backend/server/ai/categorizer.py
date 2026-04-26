# import json
# import re
# import pandas as pd
# import joblib
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.linear_model import LogisticRegression
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.svm import LinearSVC
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score, classification_report
# import os

# # ─────────────────────────────────────────
# # NLP Setup
# # ─────────────────────────────────────────
# try:
#     import nltk
#     from nltk.corpus import stopwords
#     from nltk.stem import WordNetLemmatizer
#     from nltk.tokenize import word_tokenize

#     nltk.download('stopwords', quiet=True)
#     nltk.download('wordnet',   quiet=True)
#     nltk.download('punkt',     quiet=True)
#     nltk.download('punkt_tab', quiet=True)
#     nltk.download('omw-1.4',   quiet=True)

#     lemmatizer  = WordNetLemmatizer()
#     stop_words  = set(stopwords.words('english'))
#     NLP_ENABLED = True
#     print("✅ NLP (NLTK) loaded successfully!")

# except Exception as e:
#     print(f"⚠️ NLP not available: {e} — using basic cleaning")
#     NLP_ENABLED = False

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # ─────────────────────────────────────────
# # Try loading saved model first
# # ─────────────────────────────────────────
# import joblib

# MODEL_PATH      = os.path.join(BASE_DIR, 'saved_model.pkl')
# VECTORIZER_PATH = os.path.join(BASE_DIR, 'saved_vectorizer.pkl')

# if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
#     print("⚡ Loading saved model from disk — no retraining needed!")
#     model           = joblib.load(MODEL_PATH)
#     vectorizer      = joblib.load(VECTORIZER_PATH)
#     best_model_name = "Saved Model (pre-trained)"
#     NLP_ENABLED     = True
#     USE_REAL_DATA   = True
#     cleaned_texts   = ["placeholder"]

#     def clean_text_saved(text: str) -> str:
#         import re
#         if not text:
#             return ""
#         text = str(text).lower()
#         text = re.sub(r'[^a-zA-Z\u0900-\u097F\s]', ' ', text)
#         return ' '.join(text.split())

#     def categorize_grievance(text: str) -> str:
#         cleaned    = clean_text_saved(text)
#         if not cleaned.strip():
#             return "General"
#         X_input    = vectorizer.transform([cleaned])
#         prediction = model.predict(X_input)
#         return str(prediction[0])

#     def get_model_info() -> dict:
#         return {
#             "model_used"      : best_model_name,
#             "nlp_enabled"     : True,
#             "dataset"         : "Government of India Real Grievances",
#             "training_samples": "Pre-trained",
#             "status"          : "Loaded from saved model — instant startup!",
#         }

#     print("✅ Saved model loaded! Server starting instantly!")

# else:
#     print("🔄 No saved model found — training fresh model...")
#     # REST OF YOUR EXISTING CODE CONTINUES HERE

# # ─────────────────────────────────────────
# # NLP Text Cleaning
# # ─────────────────────────────────────────

# def clean_text(text: str) -> str:
#     if not text:
#         return ""
#     text = str(text).lower()
#     text = re.sub(r'[^a-zA-Z\u0900-\u097F\s]', ' ', text)
#     text = re.sub(r'\s+', ' ', text).strip()

#     if NLP_ENABLED:
#         try:
#             tokens = word_tokenize(text)
#             tokens = [
#                 lemmatizer.lemmatize(token)
#                 for token in tokens
#                 if token not in stop_words and len(token) > 2
#             ]
#             return ' '.join(tokens)
#         except Exception:
#             pass
#     return text

# # ─────────────────────────────────────────
# # Load Dataset
# # ─────────────────────────────────────────

# print("📂 Loading real grievance dataset...")

# USE_REAL_DATA = False

# try:
#     grievance_path = os.path.join(BASE_DIR, 'no_pii_grievance.json')
#     category_path  = os.path.join(BASE_DIR, 'CategoryCode_Mapping.xlsx')

#     try:
#         with open(grievance_path, 'r', encoding='utf-8') as f:
#             grievances_data = json.load(f)
#     except json.JSONDecodeError:
#         print("⚠️ Trying MongoDB format...")
#         def clean_mongodb_json(file_path):
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 content = f.read()
#             content = re.sub(r'NumberInt\((\d+)\)', r'\1', content)
#             content = re.sub(r'ISODate\("([^"]+)"\)', r'"\1"', content)
#             content = re.sub(r'ObjectId\("([^"]+)"\)', r'"\1"', content)
#             return content
#         grievances_data = json.loads(clean_mongodb_json(grievance_path))

#     category_mapping = pd.read_excel(category_path)
#     df = pd.DataFrame(grievances_data)
#     print(f"✅ Loaded {len(df):,} real grievances!")

#     text_col     = 'remarks_text'
#     subject_col  = 'subject_content_text'
#     category_col = 'CategoryV7'

#     # Code → Name mapping
#     cat_map_str = dict(zip(
#         category_mapping['Code'].astype(str).str.strip().str.split('.').str[0],
#         category_mapping['Description'].astype(str).str.strip()
#     ))

#     # Combine text
#     df['combined_text'] = (
#         df[text_col].fillna('') + ' ' +
#         df[subject_col].fillna('')
#     )

#     # Convert codes to names
#     df['cat_key'] = df[category_col].apply(
#         lambda x: str(int(float(x))) if pd.notna(x) else None
#     )
#     df['category_name'] = df['cat_key'].map(cat_map_str)

#     # Basic cleaning
#     df = df.dropna(subset=['category_name'])
#     df = df[df['combined_text'].str.len() > 20]

#     print(f"📊 After cleaning: {len(df):,} records")

#     if len(df) == 0:
#         raise Exception("No records after cleaning!")

#     # ─── Remove vague categories ───
#     skip_keywords = ['other', 'misc', 'stoppage', 'refund', 'wrong demand']

#     def is_meaningful(cat):
#         return not any(skip in str(cat).lower() for skip in skip_keywords)

#     meaningful_cats = [
#         cat for cat in df['category_name'].value_counts().index
#         if is_meaningful(cat)
#     ]

#     # Take top 20 meaningful categories
#     top_cats = meaningful_cats[:20]
#     df = df[df['category_name'].isin(top_cats)]

#     # Remove categories with less than 10 samples
#     cat_counts  = df['category_name'].value_counts()
#     valid_cats  = cat_counts[cat_counts >= 10].index
#     df          = df[df['category_name'].isin(valid_cats)]

#     print(f"📊 After filtering: {len(df):,} records")
#     print(f"📋 Categories ({len(valid_cats)}): {valid_cats.tolist()}")

#     # ─── Balance dataset ───
#     # Each category gets max 2000 samples
#     max_per_class = 2000
#     balanced_dfs  = []

#     for cat in df['category_name'].unique():
#         subset = df[df['category_name'] == cat]
#         balanced_dfs.append(
#             subset.sample(min(len(subset), max_per_class), random_state=42)
#         )

#     df = pd.concat(balanced_dfs).reset_index(drop=True)

#     print(f"⚖️ After balancing: {len(df):,} records")
#     print(f"📊 Class distribution:\n{df['category_name'].value_counts()}")

#     texts  = df['combined_text'].tolist()
#     labels = df['category_name'].tolist()

#     print(f"✅ Final dataset size: {len(texts):,}")
#     USE_REAL_DATA = True

# except Exception as e:
#     print(f"⚠️ Real dataset failed: {e}")
#     print("🔄 Falling back to built-in training data...")

#     training_data = [
#         ("pothole on road", "Infrastructure"),
#         ("road is damaged", "Infrastructure"),
#         ("bridge is broken", "Infrastructure"),
#         ("street is flooded", "Infrastructure"),
#         ("road has big holes", "Infrastructure"),
#         ("road repair needed", "Infrastructure"),
#         ("street light not working", "Electricity"),
#         ("power cut since 2 days", "Electricity"),
#         ("electricity bill issue", "Electricity"),
#         ("no electricity in my area", "Electricity"),
#         ("transformer is broken", "Electricity"),
#         ("no water supply", "Water"),
#         ("water pipe leaking", "Water"),
#         ("dirty water coming from tap", "Water"),
#         ("water shortage in colony", "Water"),
#         ("drainage is blocked", "Water"),
#         ("garbage not collected", "Sanitation"),
#         ("drain is blocked", "Sanitation"),
#         ("dirty area near my house", "Sanitation"),
#         ("sewage overflow", "Sanitation"),
#         ("hospital not providing medicine", "Health"),
#         ("doctor absent from clinic", "Health"),
#         ("mosquito breeding in area", "Health"),
#         ("school teacher absent", "Education"),
#         ("no books provided to students", "Education"),
#         ("school building is damaged", "Education"),
#     ]
#     texts  = [t[0] for t in training_data]
#     labels = [t[1] for t in training_data]

# # ─────────────────────────────────────────
# # NLP Preprocessing
# # ─────────────────────────────────────────

# print("🔤 Applying NLP text preprocessing...")
# cleaned_texts = [clean_text(t) for t in texts]

# # Remove empty texts
# cleaned_texts_filtered = []
# labels_filtered        = []
# for ct, lb in zip(cleaned_texts, labels):
#     if len(ct.strip()) > 2:
#         cleaned_texts_filtered.append(ct)
#         labels_filtered.append(lb)

# cleaned_texts = cleaned_texts_filtered
# labels        = labels_filtered

# print(f"✅ NLP preprocessing done! {len(cleaned_texts):,} samples ready")

# # ─────────────────────────────────────────
# # TF-IDF Vectorization
# # ─────────────────────────────────────────

# vectorizer = TfidfVectorizer(
#     max_features = 10000,
#     ngram_range  = (1, 3),
#     sublinear_tf = True,
#     min_df       = 1,
#     analyzer     = 'word',
# )

# X = vectorizer.fit_transform(cleaned_texts)
# y = labels

# # ─────────────────────────────────────────
# # Train 4 Models
# # ─────────────────────────────────────────

# print("🚀 Training 4 NLP models...")

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # 1. Naive Bayes
# nb_model = MultinomialNB(alpha=0.1)
# nb_model.fit(X_train, y_train)
# nb_acc = accuracy_score(y_test, nb_model.predict(X_test))
# print(f"📊 Naive Bayes Accuracy:         {nb_acc:.3f} ({nb_acc*100:.1f}%)")

# # 2. Logistic Regression
# lr_model = LogisticRegression(max_iter=1000, C=5.0, random_state=42)
# lr_model.fit(X_train, y_train)
# lr_acc = accuracy_score(y_test, lr_model.predict(X_test))
# print(f"📊 Logistic Regression Accuracy: {lr_acc:.3f} ({lr_acc*100:.1f}%)")

# # 3. Random Forest
# rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
# rf_model.fit(X_train, y_train)
# rf_acc = accuracy_score(y_test, rf_model.predict(X_test))
# print(f"📊 Random Forest Accuracy:       {rf_acc:.3f} ({rf_acc*100:.1f}%)")

# # 4. SVM
# svm_model = LinearSVC(max_iter=2000)
# svm_model.fit(X_train, y_train)
# svm_acc = accuracy_score(y_test, svm_model.predict(X_test))
# print(f"📊 SVM Accuracy:                 {svm_acc:.3f} ({svm_acc*100:.1f}%)")

# # ─────────────────────────────────────────
# # Auto Select Best Model
# # ─────────────────────────────────────────

# all_models = {
#     "Naive Bayes"        : (nb_model,  nb_acc),
#     "Logistic Regression": (lr_model,  lr_acc),
#     "Random Forest"      : (rf_model,  rf_acc),
#     "SVM"                : (svm_model, svm_acc),
# }

# best_model_name = max(all_models, key=lambda x: all_models[x][1])
# model, best_acc = all_models[best_model_name]

# print(f"\n🏆 Best Model: {best_model_name} ({best_acc*100:.1f}% accuracy)")# Save model and vectorizer to disk
# print("💾 Saving model to disk...")
# joblib.dump(model,      MODEL_PATH)
# joblib.dump(vectorizer, VECTORIZER_PATH)
# print("✅ Model saved successfully!")



# # Detailed report
# best_pred = model.predict(X_test)
# print(f"\n📋 Detailed Classification Report:")
# print(classification_report(y_test, best_pred, zero_division=0))

# # ─────────────────────────────────────────
# # Predict Function
# # ─────────────────────────────────────────

# def categorize_grievance(text: str) -> str:
#     cleaned = clean_text(text)
#     if not cleaned.strip():
#         return "General"
#     X_input    = vectorizer.transform([cleaned])
#     prediction = model.predict(X_input)
#     return str(prediction[0])

# MODEL_PATH      = os.path.join(BASE_DIR, 'saved_model.pkl')
# VECTORIZER_PATH = os.path.join(BASE_DIR, 'saved_vectorizer.pkl')

# def get_model_info() -> dict:
#     return {
#         "model_used"      : best_model_name,
#         "nlp_enabled"     : NLP_ENABLED,
#         "dataset"         : "Government of India Real Grievances" if USE_REAL_DATA else "Built-in Training Data",
#         "training_samples": len(cleaned_texts),
#         "vocabulary_size" : len(vectorizer.vocabulary_),
#         "ngram_range"     : "1 to 3 words",
#         "accuracy"        : f"{best_acc*100:.1f}%",
#     }
# if __name__ == "__main__":
#     import sys
#     text = sys.argv[1] if len(sys.argv) > 1 else ""
#     result = categorize_grievance(text)
#     print(result)

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