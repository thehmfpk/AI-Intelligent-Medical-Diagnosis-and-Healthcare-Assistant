# AI – Intelligent Medical Diagnosis and Healthcare Assistant (Dr.HMF)

**Live website:** [www.drhmf.site](https://www.drhmf.site)  
**Repository:** [thehmfpk/AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant](https://github.com/thehmfpk/AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant)

## Overview

Dr.HMF is a full-stack artificial intelligence healthcare system. A user describes how they feel, by **typing or speaking in English, Urdu or Roman Urdu**, and the system notes the symptoms, predicts the most likely disease, and shows a medication, diet, workout and precaution plan. The user can then print a medical slip and search for a pharmacy that sells the suggested medicines.

The project combines machine learning (a trained neural network on 96,088 records and 100 diseases), a modern React interface with **light and dark themes**, a Flask prediction API, and a **conversational assistant** that talks to the user like a doctor's assistant.

> **Educational project.** Dr.HMF gives a preliminary, pattern-based estimate only. It is not a medical diagnosis and does not replace a licensed doctor. In an emergency, call Rescue 1122 or Edhi 115 (Pakistan) or go to the nearest hospital.

---

# Table of Contents

1. [What's New](#whats-new)
2. [Project Objectives](#project-objectives)
3. [Key Features](#key-features)
4. [Conversational AI Assistant](#conversational-ai-assistant-urdu-roman-urdu-and-english)
5. [Bilingual Symptoms](#bilingual-symptoms-english-and-urdu)
6. [Treatment, Print Slip and Pharmacy Finder](#treatment-print-slip-and-pharmacy-finder)
7. [Light and Dark Mode](#light-and-dark-mode)
8. [Technologies Used](#technologies-used)
9. [System Architecture](#system-architecture)
10. [Project Structure](#project-structure)
11. [Machine Learning Pipeline](#machine-learning-pipeline)
12. [Installation Guide](#installation-guide)
13. [Deployment Workflow](#deployment-workflow)
14. [Known Limitations](#known-limitations)
15. [Future Improvements](#future-improvements)
16. [Security, Privacy and Safety](#security-privacy-and-safety)
17. [Disclaimer](#disclaimer)
18. [Author, License and Acknowledgements](#author)

---

# What's New

| Feature | Summary |
|---|---|
| **Conversational AI chat** | A real chat page where the user talks to the assistant by text or voice |
| **Three ways to speak** | English, Urdu script (اردو) and Roman Urdu ("mujhe bukhar hai") |
| **Voice input and voice replies** | Speech recognition for Urdu (`ur-PK`) and English (`en-US`), with optional spoken replies |
| **Bilingual symptoms** | All 230 symptoms shown in English, Urdu, or both, searchable in any script |
| **Safety layer** | Emergency and self-harm detection with Rescue 1122 / Edhi 115 |
| **Light and dark mode** | Sun/moon toggle, remembered between visits, no flash on load |
| **Live AQI map** | Interactive map of air quality across 27 Pakistani cities (US AQI, PM2.5, PM10) with colour-coded markers, health advice in English and Urdu, and a "My location" reading |
| **Let's Begin Checkup** | New entry button; the language is detected automatically (no language switch) |
| **AI doctor guide** | An animated doctor on the Analysis page looks at the user, guides the next symptom, and has an optional voice |
| **Prediction animation** | "Done" plays a doctor-typing animation and opens the result |
| **Ranked prediction** | Top conditions with a symptom-match score, editable symptoms, and a re-run that does not reload the site |
| **Medicine map and follow-up** | What each suggested medicine is for, with a morning / afternoon / evening / night plan |
| **Treatment redesign** | Medicine cards with illustrations, nearby pharmacy map, and a one-page A4 medical slip |
| **Voice symptom entry** | A mic button on the Analysis search bar and the prediction editor: speak in English, Urdu or Roman Urdu and the symptoms are added automatically (Chrome / Edge) |
| **Advanced chat UI** | Doctor avatar, live "likely conditions" panel, quick-start prompts, automatic language |
| **Project report** | A formal report covering the problem, dataset, model, design and testing |

---

# Project Objectives

- Develop an AI-powered disease prediction system
- Assist users in preliminary healthcare analysis
- Make healthcare guidance accessible to Urdu speakers as well as English speakers
- Let users describe symptoms naturally, by voice or text, instead of ticking long lists
- Build a scalable full-stack medical AI platform that joins machine learning to a real web application
- Provide a responsive interface in light and dark themes
- Provide educational and research value in healthcare AI

---

# Key Features

## Intelligent Disease Prediction

Select symptoms (or chat about them) and the system returns the most probable disease from **100 supported diseases**. A trained Keras neural network is included in the repository and exposed through the Flask `/predict` endpoint.

## Conversational AI Assistant

A chat page with text and voice input in English, Urdu and Roman Urdu. See the [full section below](#conversational-ai-assistant-urdu-roman-urdu-and-english).

## Bilingual Symptom Selection

The Analysis page shows each of the 230 symptoms in English, Urdu, or both, with search in either script.

## Medication, Diet and Health Plans

For the predicted disease the Treatment page shows a description, suggested medications, a diet plan, a workout plan and precautions.

## Printable Medical Slip

One click prints a slip with the findings and the plan.

## Pharmacy Finder

The **Global Pharmacy** button opens a search for pharmacies near the user for the suggested medicines.

## Safety Layer

Serious symptoms and self-harm wording are detected and answered with an emergency notice instead of a normal reply.

## Light and Dark Themes

The entire interface supports both themes.

## Full Stack Architecture

React + TypeScript frontend, Express server for the production build, Flask backend with the trained model, REST API communication.

---

# Conversational AI Assistant (Urdu, Roman Urdu and English)

Open **AI Chat** in the navigation bar. The assistant behaves like a doctor's assistant: it listens, notes symptoms, asks relevant follow-up questions, and runs the analysis when the user is ready.

## What the user can do

- **Type** in English, Urdu script or Roman Urdu, or mix them
- **Speak** by tapping the microphone (Urdu `ur-PK` or English `en-US`)
- **Tap** suggested symptom chips instead of typing
- **Remove** a symptom by saying it is absent ("no fever", "bukhar nahi hai") or with the × on the list
- **Switch language display** between English, اردو and EN + اردو
- **Listen** to replies with the optional voice-reply button
- **Restart** the conversation with the reset button or by saying "start over"
- **Analyze** by tapping the Analyze button or saying "analyze", "done" or "bas"

## Example conversations

| The user says | The assistant understands |
|---|---|
| `I have a fever and cough` | fever, cough |
| `mujhe bukhar aur sar dard hai` | fever, headache |
| `مجھے بخار اور کھانسی ہے` | fever, cough |
| `pet dard aur ulti` | abdominal pain, vomiting |
| `no fever, only headache` | headache (fever excluded) |
| `meri naak band hai` | nasal congestion |
| `bukhar nhi hai lekin khansi hai` | cough (fever excluded) |

The assistant answers in the language the user used last, then asks something relevant, for example *"Noted: fever, cough, headache. Do you also have any of these? Tap to add, or tell me more."* with chips such as *sore throat* or *nasal congestion*.

## How the assistant works

```text
 Typed text or speech (ur-PK / en-US)
        │
        ▼
 1. Normalise      unify Urdu letter variants, remove diacritics, case, spacing
        │
        ▼
 2. Match          phrase index of ~2,000 aliases for 230 symptoms, longest match first;
                   26 body-part + pain-word patterns (e.g. "pet dard", "sar mein dard");
                   Urdu verb forms; one-letter typo tolerance
        │
        ▼
 3. Negation       drops symptoms the user denies ("no", "nahi", "nahin", "نہیں")
        │
        ▼
 4. Safety         18 red-flag symptoms, self-harm wording
        │
        ▼
 5. Reply          language detection, follow-up chips from the disease matrix,
                   analysis trigger
```

## Languages and scripts

- **English**: natural sentences, common synonyms and spellings
- **Urdu script (اردو)**: right-to-left text with a proper Arabic-script font (Noto Naskh Arabic)
- **Roman Urdu**: the way Urdu is typed on phones, including common spelling variants such as `nhi` and `nahi`
- **Mixed text**: for example *"mujhe headache hai"*

## Voice

- Speech recognition uses the browser's Web Speech API (best in **Chrome or Edge**, on desktop and Android).
- The recognition language follows the chat language (Urdu or English).
- Voice replies use the browser's speech synthesis and can be switched on or off.
- If the browser does not support speech, the microphone button explains this and typing keeps working.

## Safety behaviour

- **Red flags.** Symptoms such as chest pain, trouble breathing, fainting, seizures or bleeding show an urgent warning with Rescue 1122 and Edhi 115.
- **Self-harm.** Wording about self-harm gets a supportive message and emergency contacts, not an analysis.
- **Disclaimer.** The assistant says clearly that it only collects symptoms for a pattern-based estimate.

## Privacy

The assistant runs entirely in the browser. Nothing a user types or says is sent to a server by the assistant, and no API key is needed. The conversation is kept for the browser session; language choice and the last five results are remembered in local storage.

## Design choice

The assistant is a **rule-based natural-language layer written as pure functions** (`src/lib/chatEngine.ts` and `src/lib/symptomMatcher.ts`), with no network calls. This keeps it free, fast, private and easy to test, and it can later be replaced by an LLM without touching the screens.

---

# Bilingual Symptoms (English and Urdu)

- All **230 symptoms** have Urdu names, stored in `src/data/symptomTranslations.ts` together with the aliases used by the chat.
- The language toggle (**English / اردو / EN + اردو**) controls how symptoms appear on the Analysis page and in the chat, and the choice is remembered.
- Search works in English, Urdu script and Roman Urdu (for example *fever*, *بخار*, *bukhar* all find the same symptom).
- Urdu text is displayed right-to-left with proper joined letters.
- The Urdu names are machine-assisted and should be reviewed by a native speaker (see [Known Limitations](#known-limitations)).

---

# Treatment, Print Slip and Pharmacy Finder

After a prediction, the **Treatment** page shows:

- A description of the predicted disease
- Suggested medications
- A diet plan
- A workout plan
- Precautions and safety guidance

The page now contains:

- **Medicine cards** with an illustration of the medicine type, what it is for, when and how it is usually taken, how long, a tip and a warning (`src/lib/medicineGuide.ts`)
- **Daily follow-up** grouped into morning (8:00 AM), afternoon (2:00 PM), evening (6:00 PM) and night (9:30 PM), plus "as needed" items
- **Available near you**: type a city or use the device location to open an embedded map of pharmacies, hospitals, clinics or laboratories, with a "find near you" link per medicine
- **Medical slip**: an A4 slip (patient fields, symptoms, assessment, medicine table, schedule, precautions, diet, emergency notice, signature boxes), printed through a hidden frame (`src/lib/medicalSlip.ts`)

Honest limits: the pictures are illustrations of a medicine *type*, not branded products; no doses (mg) are printed, because a doctor must set them; the map shows where to look but cannot know a shop's stock, so the page tells the user to call first; and the slip is information, not a prescription, until a licensed doctor signs it.

# Live AQI Map

The **AQI Map** page (navigation and home page) shows current air quality for 27 cities on an interactive Leaflet map. Markers are coloured by the US AQI scale; selecting a city shows its AQI, PM2.5, PM10 and plain health advice in English and Urdu. **My location** adds a reading for the user's position, and data refreshes every 10 minutes.

Data comes from the free Open-Meteo air-quality API (a modelled CAMS estimate, so it can differ from a ground monitor); map tiles are from OpenStreetMap. No API key is needed. See `src/lib/aqi.ts` and `src/components/AqiMapPage.tsx`.

# Light and Dark Mode

A **sun/moon button** in the header (desktop and mobile) switches the theme.

- Every page supports both themes: Overview, Analysis, AI Chat, Prediction, Treatment and Contact
- The choice is stored in the browser and applied **before first paint**, so there is no flash
- The default is dark
- Implementation: the light theme remaps the neutral colour palette under `html.light` in `src/index.css`, controlled by `src/lib/useTheme.ts` and `src/components/ThemeToggle.tsx`

---

# Technologies Used

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion (Framer Motion)
- Lucide icons
- EmailJS (contact form)
- Web Speech API (voice input and voice replies)

## Backend

- Python
- Flask
- REST API
- Express (serves the production frontend)

## Machine Learning

- TensorFlow / Keras
- Scikit-learn
- NumPy
- Pandas
- Pickle

## Tools

- Visual Studio Code
- Git and GitHub
- Vercel (hosting and preview deployments)

---

# System Architecture

```text
 User (phone or desktop)
        │  type / speak / tap
        ▼
┌───────────────────────────────────────────────┐
│ Browser: React single-page app                │
│  Pages · Chat assistant · Language and theme  │
│  toggles · Symptom matcher · Safety rules ·   │
│  Knowledge base                               │
└───────────────────────────────────────────────┘
        ▲ served by                    │ POST /predict
 GitHub → Vercel                       ▼
                            ┌──────────────────────┐
                            │ Flask + Keras model  │
                            └──────────────────────┘
```

## Frontend Layer

- Interaction, symptom input and the chat assistant
- Bilingual symptom display and search
- Result and treatment pages, printing, pharmacy search
- Theme and language preferences

## Backend Layer

- Receives symptom data and runs the trained model
- Returns `predicted_disease`, `confidence` and `medical_advice` as JSON

## Machine Learning Layer

- Symptom vectors (230 binary inputs)
- Neural-network classification into 100 diseases
- Label encoding and decoding

> **Current state.** The live website selects the best match with a browser-side symptom-overlap lookup. The trained network is packaged in the Flask backend and ready to be connected. See [Known Limitations](#known-limitations).

---

# Project Structure

```text
AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant/
│
├── backend/
│   ├── app.py                   # Flask API (/ and /predict)
│   ├── predictor.py
│   ├── model_loader.py
│   ├── medical_advice.py
│   ├── requirements.txt
│   ├── datasets/
│   │   ├── Diseases_and_Symptoms_dataset.csv
│   │   └── description.csv      # description, diet, precautions, workouts, medication
│   └── model/
│       ├── disease_model.h5
│       ├── feature_columns.pkl
│       └── label_encoder.pkl
│
├── src/
│   ├── components/
│   │   ├── HomePage.tsx
│   │   ├── AnalysisPage.tsx     # symptom picker, bilingual, multi-script search
│   │   ├── ChatAssistant.tsx    # voice and text chat interface
│   │   ├── ResultPage.tsx
│   │   ├── MedicationPage.tsx   # plans, print slip, pharmacy finder
│   │   ├── ContactPage.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx   # English / اردو / both
│   │   ├── ThemeToggle.tsx      # light / dark
│   │   └── SymptomName.tsx
│   ├── data/
│   │   ├── medicalData.ts
│   │   └── symptomTranslations.ts   # Urdu names and aliases, 230 symptoms
│   ├── lib/
│   │   ├── symptomMatcher.ts    # Urdu / Roman Urdu / English symptom extraction
│   │   ├── chatEngine.ts        # dialogue logic
│   │   ├── usePersistentState.ts
│   │   └── useTheme.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── Dr_HMF — ML_Pipeline.ipynb   # training and evaluation notebook
├── server.ts                    # Express server for the production build
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

# Machine Learning Pipeline

The full workflow is in `Dr_HMF — ML_Pipeline.ipynb`.

## Dataset

- **96,088** records
- **100** diseases (about 800 to 1,200 records each)
- **230** binary symptom features (1 to 12 symptoms per record, 5.9 on average)
- A knowledge base (`description.csv`) with description, diet, precautions, workouts and medication for each disease

## Pipeline Stages

1. **Data collection**: symptom and disease records plus the knowledge base
2. **Data cleaning**: consistent names, removal of inconsistencies
3. **Feature engineering**: each record becomes a 230-length binary vector
4. **Label encoding**: disease names become numeric classes
5. **Stratified split**: 70% train, 15% validation, 15% test (seed 42)
6. **Model training**: Keras neural network
7. **Evaluation**: accuracy, precision, recall and F1 on the held-out test set
8. **Model saving**: model and encoders stored for inference

## Model Architecture

Dense 512 → 256 → 128 → 64 → softmax (100 classes), with batch normalisation and dropout, Adam optimiser (learning rate 0.0005), categorical cross-entropy, 10 epochs, batch size 32. About 301,000 parameters.

## Results (test set, 14,414 records)

| Metric | Score |
|---|---|
| Accuracy | 88.78% |
| Precision (weighted) | 89.71% |
| Recall (weighted) | 88.78% |
| F1 (weighted) | 88.85% |

- 60 of the 100 diseases reach an F1 score of 0.90 or higher
- Best classes: benign prostatic hyperplasia, obstructive sleep apnea, bursitis, concussion, developmental disability
- Weakest classes: skin polyp, skin pigmentation disorder, personality disorder, COPD, acute bronchospasm, pneumonia
- Training and validation accuracy both settle near 89% with no sign of overfitting

## Prediction API

`POST /predict` returns:

```json
{
  "predicted_disease": "...",
  "confidence": 0.0,
  "medical_advice": { }
}
```

---

# Installation Guide

## Clone

```bash
git clone https://github.com/thehmfpk/AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant.git
cd AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant
```

## Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.

Production build:

```bash
npm run build
npm start
```

## Backend

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install and run

```bash
pip install -r backend/requirements.txt
cd backend
python app.py
```

Runs on `http://localhost:5000`.

## Using the chat and voice

- Open **AI Chat** and type, or tap the microphone and allow microphone access
- Voice works best in **Chrome or Edge**; Urdu voice needs a browser that supports `ur-PK`
- Typing always works in every browser

## Environment Variables

The contact form uses EmailJS. Keep keys out of the repository and store them in a `.env` file:

```env
API_KEY=YOUR_API_KEY
SECRET_KEY=YOUR_SECRET_KEY
```

---

# Deployment Workflow

The repository is connected to Vercel. A pushed feature branch gets a private preview deployment; merging into `main` updates the live site.

```text
feature branch → push to GitHub → Vercel preview → pull request → merge to main → www.drhmf.site
```

---

# Known Limitations

- **The website does not yet call the trained model.** It currently uses a browser-side symptom-overlap lookup; the trained network (88.78% test accuracy) sits in the Flask backend.
- **Result tiles are static.** The "90.2% accuracy" and "12 ms" values on the result page are fixed text, not measured live.
- **Urdu translations need review.** The 230 Urdu symptom names should be checked by a native speaker.
- **The assistant is rule-based.** It understands the phrases in its dictionary and typo variants, not unlimited free language.
- **Voice depends on the browser.** Speech recognition quality and Urdu support vary between browsers and devices.
- **Pharmacy search is a generic web search**, not a live stock or map lookup.
- **Prediction is pattern-based and educational**, not a clinical diagnosis. Rare or weakly represented diseases score lower.

---

# Future Improvements

- Call the trained Flask model from the website and show the real confidence
- Native-speaker review of the Urdu translations
- Optional LLM-powered conversation on top of the current rule-based assistant
- Medical report analysis
- User authentication and medical history
- Cloud database integration
- Pharmacy finder with real maps and stock lookup
- More languages (for example Punjabi and Sindhi)
- Model calibration and deep learning optimisation
- Mobile application version

---

# Security, Privacy and Safety

- Secrets are kept in environment variables, not in the repository
- Chat and symptom data stay in the browser (session and local storage); the assistant sends nothing to a server
- API-based architecture with backend separation and input processing
- Emergency and self-harm detection with local emergency numbers
- A disclaimer on results

---

# Educational Value

This project demonstrates artificial intelligence, machine learning, full-stack development, natural-language handling in two languages and three scripts, accessible and themeable UI design, and API integration. It can serve as a final year project, a portfolio project, an AI healthcare research prototype or an educational system.

---

# Disclaimer

This project is developed for educational and research purposes, artificial intelligence experimentation and healthcare technology learning. It does not replace professional medical diagnosis or treatment. Always consult a licensed healthcare professional for medical advice, and in an emergency call your local emergency number.

---

# Author

## Hafiz Muhammad Faizan

AI/ML Engineer | Full Stack Developer

www.hafizmfaizan.site

### Specializations

- Artificial Intelligence
- Machine Learning
- Full Stack Development
- React Development
- Python Development
- Healthcare AI Systems
- API Development

---

# GitHub Topics

```text
ai machine-learning healthcare medical-ai react flask python fullstack
artificial-intelligence disease-prediction tensorflow vite chatbot
urdu roman-urdu voice-assistant dark-mode light-mode
```

---

# License

This project is licensed under the MIT License.

---

# Acknowledgements

- Open-source contributors
- React and Python ecosystems
- TensorFlow and Scikit-learn communities
- Healthcare dataset providers

---

# Conclusion

Dr.HMF brings machine learning, a conversational assistant that understands English, Urdu and Roman Urdu by text and voice, and a responsive light and dark interface into one healthcare platform. It guides a user from describing symptoms, to a preliminary prediction, to a treatment plan, a printable slip and a pharmacy search, with safety checks and clear limits built in.
