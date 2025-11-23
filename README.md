# Finlytics - AI-Powered Micro Cap Stock Assistant

Finlytics is a full-stack web application that provides AI-powered analysis and insights for micro-cap stocks. The platform combines modern web technologies with machine learning to deliver real-time stock analysis and interactive features.

## 🚀 Features

- **Stock Analysis Dashboard**: Real-time visualization and analysis of micro-cap stocks
- **AI Chat Assistant**: Interactive chatbot for stock-related queries
- **Technical Analysis**: Advanced stock price predictions and pattern recognition
- **Financial Document Analysis**: Automated parsing of 10-K, 10-Q and 8K reports

## 🛠️ Tech Stack

### Frontend
- Next.js 15.0
- React 18
- TypeScript
- TailwindCSS
- NextUI Components
- Recharts for data visualization

### Backend
- Python 3.9.20
- FastAPI
- Machine Learning Models
- GPU Acceleration Support

## 🏗️ Project Structure

```
.
├── next-app/           # Frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable React components
│   └── public/        # Static assets
│
└── server/            # Backend application
    ├── app/          # FastAPI application
    └── rag_index/    # RAG (Retrieval-Augmented Generation) indexes
```

## 🚦 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd next-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment variables:
```bash
cp .env.template .env
```

5. Start the FastAPI server:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```

## 📦 Deployment

The application is configured for deployment on Vercel (frontend) and can be deployed to any Python-supporting platform for the backend (e.g., AWS, GCP, or Azure).

For detailed deployment instructions, check out:
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [FastAPI deployment guide](https://fastapi.tiangolo.com/deployment/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.