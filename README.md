# AI – Intelligent Medical Diagnosis and Healthcare Assistant (Dr.HMF)

**Live website:** [www.drhmf.site](https://www.drhmf.site)  
**Repository:** [thehmfpk/AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant](https://github.com/thehmfpk/AI-Intelligent-Medical-Diagnosis-and-Healthcare-Assistant)

## Overview

Dr.HMF is a full-stack artificial intelligence healthcare system. A user describes how they feel, by **typing or speaking in English, Urdu or Roman Urdu**, and the system notes the symptoms, predicts the most likely disease, and shows a medication, diet, workout and precaution plan. The user can then print a medical slip and search for a pharmacy that sells the suggested medicines.

The project combines machine learning (a trained neural network on 96,088 records and 100 diseases), a modern React interface with **light and dark themes** that works from small phones to large desktops, a Flask prediction API, a **conversational assistant** that talks to the user like a doctor's assistant, and a **live air-quality map with a personal health-risk check**.

> **Educational project.** Dr.HMF gives a preliminary, pattern-based estimate only. It is not a medical diagnosis and does not replace a licensed doctor. In an emergency, call Rescue 1122 or Edhi 115 (Pakistan) or go to the nearest hospital.

---

# Table of Contents

1. [What's New](#whats-new)
2. [Project Objectives](#project-objectives)
3. [Key Features](#key-features)
4. [Conversational AI Assistant](#conversational-ai-assistant-urdu-roman-urdu-and-english)
5. [Bilingual Symptoms](#bilingual-symptoms-english-and-urdu)
6. [Home Page and Hero](#home-page-and-hero)
7. [Analysis, AI Doctor and Prediction](#analysis-ai-doctor-and-prediction)
8. [Treatment, Print Slip and Pharmacy Finder](#treatment-print-slip-and-pharmacy-finder)
9. [Live AQI Map and Health Risk Check](#live-aqi-map-and-health-risk-check)
10. [Light and Dark Mode](#light-and-dark-mode)
11. [Responsive Design and Accessibility](#responsive-design-and-accessibility)
12. [Technologies Used](#technologies-used)
13. [System Architecture](#system-architecture)
14. [Project Structure](#project-structure)
15. [Machine Learning Pipeline](#machine-learning-pipeline)
16. [Installation Guide](#installation-guide)
17. [Deployment Workflow](#deployment-workflow)
18. [Known Limitations](#known-limitations)
19. [Future Improvements](#future-improvements)
20. [Security, Privacy and Safety](#security-privacy-and-safety)
21. [Disclaimer](#disclaimer)
22. [Author, License and Acknowledgements](#author)

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
| **New hero** | Full-screen hero with a large "HEALTHCARE COMPANION" title, an animated robot doctor reading a medical report, live-count stat chips and a mesh-gradient background (dark and light) |
| **Redesigned home page** | Ticker, How it works, Features, Live air quality, "Built to be honest", FAQ and a closing call to action, each with its own gradient mood; the old placeholder sections with unsupported claims were removed |
| **Header and footer redesign** | Logo and name on the left, navigation in the centre, actions on the right; hamburger menu below 1024 px; footer with real links only |
| **Live AQI map** | Interactive map of air quality across 27 Pakistani cities (US AQI, PM2.5, PM10) with colour-coded markers, health advice in English and Urdu and a "My location" reading |
| **Search any city** | Worldwide place search on the AQI page (Open-Meteo geocoding) with a live reading and marker for the chosen place |
| **Health risk check** | The user enters age group, conditions, daily activity, smoking, mask and purifier; the page returns a personal risk level, precautions in English and Urdu, the cleanest hours of the next 24 hours and when to seek help |
| **Map layering fix** | The map no longer slides over the navbar when the page scrolls |
| **Let's Begin Checkup** | New entry button; the language is detected automatically (no language switch) |
| **AI doctor guide** | An animated doctor on the Analysis page looks at the user, guides the next symptom, and has an optional voice |
| **Prediction animation** | "Done" plays a doctor-typing animation and opens the result |
| **Ranked prediction** | Top conditions ranked by symptom match, editable symptoms, and a re-run that does not reload the site |
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

An embedded map on the Treatment page shows pharmacies, hospitals, clinics or laboratories near a typed city or the device location. It shows where to look; it cannot know a shop's stock, so the page asks the user to call first.

## Safety Layer

Serious symptoms and self-harm wording are detected and answered with an emergency notice instead of a normal reply.

## Light and Dark Themes

The entire interface supports both themes.

## Live Air Quality and Health Risk

A live AQI map for Pakistan and any searched city, plus a personal health-risk check with precautions. See [Live AQI Map and Health Risk Check](#live-aqi-map-and-health-risk-check).

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

# Home Page and Hero

The home page is built from one full-width hero and a set of themed sections. Every section has its own mesh-gradient mood in the site's cyan, blue, indigo and emerald palette, with matching pastel versions in light mode.

## Hero

- A full-screen (100% viewport height) hero with no side gaps, a large **HEALTHCARE COMPANION** title that stays on one line on desktop, and an **original SVG robot doctor** (`src/components/RobotDoctor.tsx`) that reads a medical report on a tablet, blinks and tilts its head.
- Two stat chips show real numbers from the project data (230 symptoms, 100 conditions).
- A slowly moving mesh-gradient background with light grain, a soft bottom fade and a glow line that separates it from the next section.
- On short laptop screens the hero grows instead of clipping; on phones the title wraps to two lines and the text and buttons sit under the robot.

## Sections below the hero

| Section | What it shows |
|---|---|
| **Ticker** | A slow scrolling strip of what the app offers (pauses on hover and is static with reduced motion) |
| **How it works** | Four step cards (tell, match, plan, stay safe), each linking to the right page |
| **Features** | Symptom checker, languages, voice input, AI chat, medicine guide and slip |
| **Live air quality** | Real AQI cards for Lahore, Karachi, Islamabad and Peshawar, with a button to the map |
| **Built to be honest** | Not a diagnosis, no medicine doses, your data stays with you, and an emergency notice |
| **FAQ** | Six short answers about what Dr.HMF can and cannot do |
| **Final call to action** | Start a checkup or open the AQI map |

The home page makes no claims the product cannot back up: earlier placeholder text about data volumes, encryption and "medical nodes" was removed, and the footer links only to real pages.

Files: `src/components/HeroSection.tsx`, `src/components/home/ui.tsx`, `src/components/home/sections.tsx`, `src/components/home/sections2.tsx`, `src/components/Footer.tsx`.

---

# Analysis, AI Doctor and Prediction

- **Let's Begin Checkup** opens the Analysis page; the display language is detected automatically, so there is no language switch to operate.
- An **animated doctor** looks at the user (the pupils follow the pointer), reacts while the user types and can speak guidance aloud.
- Symptoms are searched in English, Urdu or Roman Urdu, or added by voice with the mic button (Chrome / Edge).
- **Done** plays a short doctor-typing animation, then the **Prediction** page ranks the closest conditions by how well the symptoms match.
- On the Prediction page the symptoms can be edited (including by voice) and the prediction re-run without reloading the site. A medicine map explains what each suggested medicine is for, and a follow-up timeline groups the plan into morning, afternoon, evening and night.

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

# Live AQI Map and Health Risk Check

The **AQI Map** page (navigation, home page and footer) combines a live map with a personal health-risk tool.

## Live map

- Current air quality for **27 Pakistani cities** on an interactive Leaflet map, with markers coloured by the US AQI scale
- Selecting a city shows its AQI, PM2.5, PM10 and plain health advice in English and Urdu, and a list ranks the cities from worst to best
- **Search any city in the world** (Open-Meteo geocoding) to get a live reading and a marker for it
- **My location** adds a reading for the user's position
- Data refreshes every 10 minutes
- The map sits in its own stacking context, so it never paints over the navbar when the page scrolls

## My health risk check

Below the map, the user enters:

- age group (child, teen / adult, older adult)
- optional health conditions (asthma / COPD, heart disease / high blood pressure, pregnancy, diabetes, allergies, recent chest infection)
- today's activity (mostly indoors, some time outside, outdoor work or exercise)
- smoking, whether they have an N95 mask and whether they have an air purifier

The page then shows, for the place selected on the map:

- a **personal risk level** (low, moderate, high, very high, severe) and score, calculated from today's AQI adjusted for age, conditions and activity (`src/lib/healthRisk.ts`)
- **precautions** that fit the answers (mask type, windows, exercise, purifier, inhaler and routine reminders, hydration, what to avoid), each in English and Urdu
- the **next 24 hours** of AQI as a small chart and the **cleanest three hours** for outdoor errands
- **when to get help**, with a shortcut to start a symptom checkup

The answers stay in the browser tab and are never saved or sent anywhere; only a place's coordinates are used to fetch air data. The score is a simple guide, not a medical measurement, and the page contains no medicine doses.

## Data and files

Data comes from the free Open-Meteo air-quality and geocoding APIs (a modelled CAMS estimate, so it can differ from a ground monitor). Map tiles are from OpenStreetMap. No API key is needed.

Files: `src/lib/aqi.ts`, `src/lib/healthRisk.ts`, `src/components/AqiMapPage.tsx`, `src/components/AqiHealthCheck.tsx`.

# Light and Dark Mode

A **sun/moon button** in the header (desktop and mobile) switches the theme.

- Every page supports both themes: Overview, Analysis, AI Chat, Prediction, Treatment and Contact
- The choice is stored in the browser and applied **before first paint**, so there is no flash
- The default is dark
- Implementation: the light theme remaps the neutral colour palette under `html.light` in `src/index.css`, controlled by `src/lib/useTheme.ts` and `src/components/ThemeToggle.tsx`

# Responsive Design and Accessibility

- Layouts were checked at phone (320 to 390 px), tablet (768 px), laptop (1024 to 1366 px) and large desktop (1920 px) widths in both themes, with no horizontal scrolling
- The hero fills exactly one screen and grows on short screens instead of clipping content
- Below 1024 px the header switches to a hamburger menu
- Gradient headings keep their last letters visible when they wrap onto a second line
- Animations respect the *reduce motion* setting
- Controls have labels and the keyboard focus order is preserved; form groups, results and alerts use proper roles

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
- Leaflet and OpenStreetMap tiles (maps)
- Open-Meteo air-quality and geocoding APIs (live AQI, forecast and place search; no API key)

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
│   │   ├── HeroSection.tsx      # full-screen hero with the robot doctor
│   │   ├── RobotDoctor.tsx      # original SVG robot illustration
│   │   ├── home/                # ticker, how it works, features, live air, trust, FAQ, CTA
│   │   │   ├── ui.tsx
│   │   │   ├── sections.tsx
│   │   │   └── sections2.tsx
│   │   ├── AnalysisPage.tsx     # symptom picker, bilingual, multi-script and voice search
│   │   ├── DoctorAvatar.tsx     # animated AI doctor
│   │   ├── PredictionAnimation.tsx
│   │   ├── ChatAssistant.tsx    # voice and text chat interface
│   │   ├── ResultPage.tsx       # ranked prediction, editable symptoms
│   │   ├── FollowUpTimeline.tsx
│   │   ├── MedicationPage.tsx   # medicine cards, nearby map, print slip
│   │   ├── MedicineImage.tsx
│   │   ├── AqiMapPage.tsx       # live AQI map, city search
│   │   ├── AqiHealthCheck.tsx   # personal health-risk check
│   │   ├── ContactPage.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MicButton.tsx
│   │   ├── ThemeToggle.tsx      # light / dark
│   │   ├── SymptomName.tsx
│   │   └── LanguageToggle.tsx   # no longer used (language is detected automatically)
│   ├── data/
│   │   ├── medicalData.ts
│   │   └── symptomTranslations.ts   # Urdu names and aliases, 230 symptoms
│   ├── lib/
│   │   ├── symptomMatcher.ts    # Urdu / Roman Urdu / English symptom extraction
│   │   ├── chatEngine.ts        # dialogue logic
│   │   ├── predictor.ts         # ranks diseases from symptoms
│   │   ├── medicineGuide.ts     # class-level medicine information (no doses)
│   │   ├── medicalSlip.ts       # printable A4 slip
│   │   ├── aqi.ts               # live AQI, forecast and place search
│   │   ├── healthRisk.ts        # personal risk level and precautions
│   │   ├── autoLanguage.ts
│   │   ├── useSpeechInput.ts    # Web Speech API hook
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
- **Urdu translations need review.** The 230 Urdu symptom names should be checked by a native speaker.
- **The assistant is rule-based.** It understands the phrases in its dictionary and typo variants, not unlimited free language.
- **Voice depends on the browser.** Speech recognition quality and Urdu support vary between browsers and devices.
- **The pharmacy map shows where to look, not what is in stock.** Users should call before going.
- **Air quality is a modelled estimate** (Open-Meteo / CAMS) and can differ from a ground monitor; the health-risk score is a simple guide, not a medical measurement.
- **Medicine information is general and class-level.** No doses are shown, and the printed slip is not a prescription.
- **Prediction is pattern-based and educational**, not a clinical diagnosis. Rare or weakly represented diseases score lower.

---

# Future Improvements

- Call the trained Flask model from the website and show the real confidence
- Native-speaker review of the Urdu translations
- Optional LLM-powered conversation on top of the current rule-based assistant
- Medical report analysis
- User authentication and medical history
- Cloud database integration
- Real pharmacy stock lookup (needs a data partner)
- Air-quality readings from ground monitors alongside the model
- Saving a health-risk profile on the device (opt-in)
- More languages (for example Punjabi and Sindhi)
- Model calibration and deep learning optimisation
- Mobile application version

---

# Security, Privacy and Safety

- Secrets are kept in environment variables, not in the repository
- Chat and symptom data stay in the browser (session and local storage); the assistant sends nothing to a server
- The health-risk answers are not stored or sent anywhere; air-quality and city-search requests send only coordinates or the searched place name to Open-Meteo
- Only the last five prediction results (disease name, date, symptom count) are kept in local storage on the user's device
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
aqi air-quality leaflet health-risk responsive-design
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

Dr.HMF brings machine learning, a conversational assistant that understands English, Urdu and Roman Urdu by text and voice, and a responsive light and dark interface into one healthcare platform. It guides a user from describing symptoms, to a preliminary prediction, to a treatment plan, a printable slip and a pharmacy search, with safety checks and clear limits built in. A live air-quality map and a personal health-risk check extend that care to the air the user breathes every day.
