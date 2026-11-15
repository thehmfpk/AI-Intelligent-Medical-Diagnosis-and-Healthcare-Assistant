# Dr.HMF AI – Intelligent Medical Diagnosis and Healthcare Assistant

**Live website:** [www.drhmf.site](https://www.drhmf.site)

## Overview

Dr.HMF AI is a full-stack artificial intelligence healthcare system that helps users describe their symptoms, get a preliminary disease prediction, and receive medication, diet, workout and precaution guidance. It combines a machine learning model, a modern React interface, a Flask prediction API and a bilingual (Urdu and English) conversational assistant that works by text and by voice.

The project demonstrates the practical use of artificial intelligence in healthcare technology by bringing together data science, machine learning engineering, frontend and backend development, and an accessible, safety-aware user experience.

> **Educational project.** Dr.HMF gives a preliminary, pattern-based estimate only. It is not a medical diagnosis and does not replace a licensed doctor.

---

# What's New

- **Conversational AI chat assistant** – describe how you feel by typing or speaking and the assistant notes your symptoms, asks relevant follow-ups and runs the analysis.
- **Urdu and English everywhere** – all 230 symptoms are shown in English, Urdu, or both, and can be searched in English, Urdu script or Roman Urdu (for example "bukhar").
- **Voice input and voice replies** – speech recognition for Urdu (`ur-PK`) and English (`en-US`), with optional spoken replies.
- **Built-in safety checks** – serious symptoms and self-harm wording trigger an emergency notice (Rescue 1122 / Edhi 115 in Pakistan).
- **Light mode and dark mode** – a sun/moon toggle in the header; the choice is remembered and applied before the page paints, so there is no flash.
- **Full project report** – a formal report covering the problem, dataset, model, design and testing.

---

# Project Objectives

- Develop an AI-powered disease prediction system
- Assist users in preliminary healthcare analysis
- Build a scalable full-stack medical AI platform
- Integrate machine learning into a real-world web application
- Make healthcare guidance accessible in Urdu as well as English
- Provide a responsive, modern interface in light and dark themes
- Provide educational and research value in healthcare AI

---

# Key Features

## Intelligent Disease Prediction

Select symptoms and the system returns the most probable disease from 100 supported diseases. A trained neural network (Keras) is included in the repository and exposed through the Flask `/predict` endpoint.

## Conversational AI Assistant (Urdu and English)

The **AI Chat** page is a chat interface where users talk to the system like a doctor's assistant:

- Type or tap the microphone and speak in **Urdu, Roman Urdu or English**
- Understands natural sentences such as *"mujhe bukhar aur sar dard hai"* or *"I have a fever and cough"*
- Recognises 230 symptoms through about 2,000 aliases, tolerates one-letter typos, and understands negation ("no fever" / "bukhar nahi hai")
- Replies in the language the user is using and suggests related symptoms as tap-to-add chips
- Keeps a live "Symptoms noted" list with an **Analyze** button
- Conversation is kept for the browser session; language choice and recent results are remembered

The assistant is a rule-based natural-language layer that runs in the browser (no API key, no cost, no data sent away). It is written as pure functions so it can later be swapped for an LLM.

## Bilingual Symptom Display

A language toggle (**English / اردو / EN + اردو**) controls how symptoms are shown on both the Analysis page and the chat. Urdu text uses a proper Arabic-script font and right-to-left layout.

## Medication, Diet and Health Plans

After a prediction the **Treatment** page shows the disease description, suggested medications, a diet plan, a workout plan and precautions.

## Printable Medical Slip and Pharmacy Finder

- **Print Protocol** produces a printable slip with the findings and plan
- **Global Pharmacy** opens a search for pharmacies near the user for the suggested medicines

## Safety Layer

- 18 red-flag symptoms (for example chest pain, trouble breathing, fainting, seizures, bleeding) show an urgent warning
- Self-harm wording shows a supportive message and emergency contacts instead of an analysis
- Every result carries a disclaimer

## Light and Dark Themes

The whole interface supports both themes. The toggle sits in the header (desktop and mobile). The theme is stored in the browser and applied before first paint.

## Full Stack Architecture

- React and TypeScript frontend
- Express server that serves the production build
- Python Flask backend with the trained model
- REST API communication

## Machine Learning Pipeline

Data preprocessing, encoding, model training, evaluation and prediction, documented in the included notebook.

## Modular Code Structure

Reusable components, a separate data layer and pure-function logic for matching and chat, so each part is easy to test and extend.

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
- Web Speech API (voice input and voice output)

## Backend

- Python
- Flask
- REST API
- Express (serves the built frontend)

## Machine Learning

- TensorFlow / Keras
- Scikit-learn
- NumPy
- Pandas
- Pickle

## Development Tools

- Visual Studio Code
- Git and GitHub
- Vercel (hosting and preview deployments)

---

# System Architecture

```text
 User (phone or desktop)
        │  type / speak / tap
        ▼
┌─────────────────────────────────────────┐
│ Browser: React single-page app          │
│  Pages · Chat assistant · Language and  │
│  theme toggles · Symptom matcher ·      │
│  Safety rules · Knowledge base          │
└─────────────────────────────────────────┘
        ▲ served by                 │ /predict (Flask API)
 GitHub → Vercel                    ▼
                         ┌─────────────────────┐
                         │ Flask + Keras model │
                         └─────────────────────┘
```

## Frontend Layer

- User interaction, symptom input and the chat assistant
- Bilingual symptom display and search
- Result and treatment pages, printing, pharmacy search
- Theme and language preferences

## Backend Layer

- Receives symptom data and runs the trained model
- Returns `predicted_disease`, `confidence` and `medical_advice` as JSON

## Machine Learning Layer

- Symptom vectorisation (230 binary inputs)
- Disease classification (100 classes) with a neural network
- Label encoding and decoding

> **Current state:** the live website currently picks the best match with a browser-side symptom-overlap lookup, and the trained network is packaged in the Flask backend. Connecting the website directly to `/predict` is the next planned step.

---

# Project Structure

```text
Dr.HMF-AI-Medical-Agent/
│
├── backend/
│   ├── app.py                  # Flask API (/ and /predict)
│   ├── predictor.py
│   ├── model_loader.py
│   ├── medical_advice.py
│   ├── requirements.txt
│   ├── datasets/
│   │   ├── Diseases_and_Symptoms_dataset.csv
│   │   └── description.csv     # descriptions, diet, precautions, workouts, medication
│   └── model/
│       ├── disease_model.h5
│       ├── feature_columns.pkl
│       └── label_encoder.pkl
│
├── src/
│   ├── components/
│   │   ├── HomePage.tsx
│   │   ├── AnalysisPage.tsx    # symptom picker, bilingual, multi-script search
│   │   ├── ChatAssistant.tsx   # voice and text chat
│   │   ├── ResultPage.tsx
│   │   ├── MedicationPage.tsx  # plans, print slip, pharmacy finder
│   │   ├── ContactPage.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── ThemeToggle.tsx     # light / dark switch
│   │   └── SymptomName.tsx
│   ├── data/
│   │   ├── medicalData.ts
│   │   └── symptomTranslations.ts   # Urdu names and aliases for 230 symptoms
│   ├── lib/
│   │   ├── symptomMatcher.ts   # Urdu / Roman Urdu / English symptom extraction
│   │   ├── chatEngine.ts       # dialogue logic
│   │   ├── usePersistentState.ts
│   │   └── useTheme.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── Dr_HMF — ML_Pipeline.ipynb  # training and evaluation notebook
├── server.ts                   # Express server for the production build
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

# Frontend Description

Built with React and TypeScript on Vite.

## Main Pages

- **Overview** – landing page
- **Analysis** – pick symptoms from 230 options, shown in English, Urdu or both, with search in either script
- **AI Chat** – the conversational assistant
- **Prediction** – the predicted disease for the chosen symptoms
- **Treatment** – medication, diet, workouts, precautions, printable slip, pharmacy search
- **Contact** – contact form

---

# Backend Description

The Flask backend loads the trained model once and answers prediction requests.

## `POST /predict`

Request body: the selected symptoms. Response:

```json
{
  "predicted_disease": "...",
  "confidence": 0.0,
  "medical_advice": { }
}
```

---

# Machine Learning Pipeline

The workflow is documented in `Dr_HMF — ML_Pipeline.ipynb`.

## Dataset

- 96,088 records
- 100 diseases (about 800 to 1,200 records each)
- 230 binary symptom features (1 to 12 symptoms per record, 5.9 on average)

## Pipeline Stages

1. **Data collection** – symptom and disease records plus a knowledge base of descriptions, diet, precautions, workouts and medication
2. **Data cleaning** – consistent names and removal of inconsistencies
3. **Feature engineering** – each record becomes a 230-length binary vector
4. **Label encoding** – disease names become numeric classes
5. **Stratified split** – 70% train, 15% validation, 15% test (seed 42)
6. **Model training** – Keras neural network
7. **Evaluation** – accuracy, precision, recall and F1 on the held-out test set
8. **Model saving** – model and encoders stored for inference

## Model Architecture

Dense 512 → 256 → 128 → 64 → softmax (100), with batch normalisation and dropout, Adam optimiser (learning rate 0.0005), categorical cross-entropy, 10 epochs, batch size 32. About 301,000 parameters.

## Results (test set, 14,414 records)

| Metric | Score |
|---|---|
| Accuracy | 88.78% |
| Precision (weighted) | 89.71% |
| Recall (weighted) | 88.78% |
| F1 (weighted) | 88.85% |

60 of the 100 diseases reach an F1 score of 0.90 or higher. The weakest classes are skin polyp, skin pigmentation disorder, personality disorder, COPD, acute bronchospasm and pneumonia.

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/thehmfpk/Dr.HMF-AI-Medical-Agent.git
cd Dr.HMF-AI-Medical-Agent
```

## Frontend Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

## Backend Setup

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

### Install and Run

```bash
pip install -r backend/requirements.txt
cd backend
python app.py
```

The API runs on `http://localhost:5000`.

## Browser Notes

- **Voice input** uses the browser's speech recognition (best in Chrome or Edge on desktop and Android). Typing always works.
- **Urdu voice** needs a browser that supports the `ur-PK` language.

---

# Environment Variables

The contact form uses EmailJS. Keep keys out of the repository and store them in a `.env` file when you configure them:

```env
API_KEY=YOUR_API_KEY
SECRET_KEY=YOUR_SECRET_KEY
```

---

# Deployment Workflow

The repository is connected to Vercel. Pushing a feature branch creates a private preview deployment, and merging into `main` updates the live site.

```text
feature branch → push to GitHub → Vercel preview → pull request → merge to main → www.drhmf.site
```

---

# Future Improvements

## Planned Enhancements

- Call the trained Flask model from the website (`/predict`) and show the real confidence
- Native-speaker review of the Urdu symptom translations
- Optional LLM-powered conversation on top of the current rule-based assistant
- Medical report analysis
- User authentication and medical history
- Cloud database integration
- Pharmacy finder with real maps and stock lookup
- More languages (for example Punjabi and Sindhi)
- Deep learning optimisation and calibration
- Mobile application version

---

# Security Considerations

- Environment variables for secrets
- Chat and symptom data stay in the browser (session and local storage); nothing is sent to a server by the assistant
- API-based architecture with backend separation
- Input processing and validation

---

# Scalability

Potential areas: cloud deployment, distributed APIs, advanced AI models, database integration, real-time analytics and multi-user systems.

---

# Educational Value

This project demonstrates practical implementation of artificial intelligence, machine learning, full-stack development, natural-language handling in two languages, accessible UI design and API integration. It can serve as a final year project, a portfolio project, an AI healthcare research prototype or an educational system.

---

# Disclaimer

This project is developed for educational and research purposes, artificial intelligence experimentation and healthcare technology learning.

The system does not replace professional medical diagnosis or treatment. In an emergency, call your local emergency number (Rescue 1122 / Edhi 115 in Pakistan) or go to the nearest hospital. Users should always consult licensed healthcare professionals for medical advice.

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

# GitHub Repository

```text
Dr.HMF-AI-Medical-Agent
```

Suggested GitHub topics:

```text
ai machine-learning healthcare medical-ai react flask python fullstack
artificial-intelligence disease-prediction tensorflow vite chatbot
urdu voice-assistant dark-mode
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

Dr.HMF AI is a healthcare AI platform that combines machine learning, a bilingual voice and text assistant and a responsive light and dark interface to guide users from symptoms to a preliminary prediction, a treatment plan, a printable slip and a pharmacy search. It shows how AI can make health information more accessible, with safety checks and clear limits built in.
