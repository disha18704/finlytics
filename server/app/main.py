from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ticker, prediction, query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(ticker.router)
app.include_router(prediction.router)
app.include_router(query.router)
