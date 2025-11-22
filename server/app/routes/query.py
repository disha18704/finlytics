from fastapi import APIRouter
import os
from dotenv import load_dotenv
from app.models.query_engine import query_engine

router = APIRouter()

@router.get("/query-rag/{user_query}")
def query_rag(user_query: str):

    response = query_engine.chat(user_query)
    
    return {'message': str(response)}