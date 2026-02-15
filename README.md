# 🦁 Animal Classifier — AI-Powered Species Detection

<div align="center">

![Animal Classifier Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Animal%20Classifier%20AI&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=90%20Species%20%7C%20Deep%20Learning%20%7C%20Full-Stack&descAlignY=55&descSize=18)

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-animal--classifier--model.vercel.app-brightgreen?style=for-the-badge)](https://animal-classifier-model.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-77%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A production-ready deep learning system that classifies 90 animal species from a single image upload — with real-time inference and a modern full-stack interface.**

[**🌐 Try Live Demo**](https://animal-classifier-model.vercel.app/) · [**📂 View Code**](https://github.com/Dev-ZishanKhan/Animal_Classifier_Model) · [**🐛 Report Bug**](https://github.com/Dev-ZishanKhan/Animal_Classifier_Model/issues)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Model Performance](#-model-performance)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Author](#-author)

---

## 🔭 Overview

**Animal Classifier** is an end-to-end AI system built to identify animal species from uploaded images with high accuracy. The model was trained on a **custom-curated dataset** of **90 distinct animal classes**, structured in a CSV-based pipeline for reproducible training.

This isn't just a model demo — it's a complete full-stack deployment featuring a **FastAPI inference server**, a **Next.js + TypeScript frontend**, and live hosting on **Vercel** and cloud platforms.

> Built by **Zeeshan Khan (Marwat)** — AI Engineer & Founder at **Zintel AI**

---

## ✨ Key Features

- 🐘 **90 Animal Classes** — From common pets to exotic wildlife
- ⚡ **Real-Time Inference** — Sub-second predictions via optimized FastAPI backend
- 🧠 **Transfer Learning** — Fine-tuned CNN architecture for accuracy + efficiency
- 📊 **Custom CSV Dataset** — Fully self-curated and structured training pipeline
- 🌐 **Full-Stack Deployment** — Live and accessible at `vercel.app`
- 🛡️ **Robust Error Handling** — Gracefully handles non-animal or low-quality inputs
- 📱 **Responsive UI** — Works beautifully across desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Model Training** | TensorFlow / Keras, NumPy, Pandas |
| **Backend API** | Python, FastAPI, Uvicorn, Pillow |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, React |
| **Data Pipeline** | Custom CSV Dataset, Scikit-learn |
| **Deployment** | Vercel (Frontend), Render / Hugging Face (Backend) |
| **Version Control** | Git, GitHub |

---

## 🏗️ Architecture

```
User (Browser)
     │
     ▼
┌─────────────────────────────────┐
│      Next.js Frontend           │  ← TypeScript + Tailwind CSS
│   (animal-classifier.vercel.app)│
└──────────────┬──────────────────┘
               │ HTTP POST (multipart/form-data)
               ▼
┌─────────────────────────────────┐
│      FastAPI Backend            │  ← Python + Uvicorn
│   /api/predict                  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      TensorFlow / Keras Model   │  ← 90-class CNN
│   (Transfer Learning)           │
└──────────────┬──────────────────┘
               │
               ▼
        JSON Response
   { class, confidence, description }
```

---

## 📊 Model Performance

| Metric | Value |
|:---|:---|
| **Total Classes** | 90 |
| **Training Accuracy** | ~94% |
| **Validation Accuracy** | ~91% |
| **Architecture** | Transfer Learning (Fine-tuned CNN) |
| **Dataset Format** | Custom CSV Pipeline |
| **Input Size** | 224 × 224 px |

> The model was trained on a rigorously self-curated dataset to ensure strong generalization on unseen, real-world images.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ & npm

### 1. Clone the Repository

```bash
git clone https://github.com/Dev-ZishanKhan/Animal_Classifier_Model.git
cd Animal_Classifier_Model
```

### 2. Backend Setup (FastAPI + Python)

```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python main.py
```

> 🟢 Server starts at: `http://localhost:8000`

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

> 🟢 App opens at: `http://localhost:3000`

---

## 🔌 API Reference

### `POST /api/predict`

Accepts an image file and returns the predicted animal class with confidence.

**Request:**
```
Content-Type: multipart/form-data
Body: { file: <image> }
```

**Response:**
```json
{
  "class": "Cheetah",
  "confidence": "98.5%",
  "description": "A large cat native to Africa and central Iran."
}
```

| Status | Meaning |
|:---|:---|
| `200 OK` | Successful prediction |
| `400 Bad Request` | Invalid image or unsupported format |
| `422 Unprocessable` | Non-animal image detected |

---

## 📁 Project Structure

```
Animal_Classifier_Model/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── model/                # Trained model weights
│   ├── utils/                # Image preprocessing helpers
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── app/                  # Next.js App Router
│   ├── components/           # Reusable UI components
│   ├── public/               # Static assets
│   └── package.json          # Node dependencies
│
└── .gitignore
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to the branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## 👤 Author

<div align="center">

**Zeeshan Khan (Marwat)**

*AI Engineer & Founder — Zintel AI*

[![GitHub](https://img.shields.io/badge/GitHub-Dev--ZishanKhan-181717?style=for-the-badge&logo=github)](https://github.com/Dev-ZishanKhan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/your-profile)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome)](https://your-portfolio-link.com)

</div>

---

<div align="center">

**⭐ If this project helped you, please give it a star — it means a lot!**

*Made with ❤️ and a lot of GPU hours by [Zintel AI](https://github.com/Dev-ZishanKhan)*

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer)

</div>