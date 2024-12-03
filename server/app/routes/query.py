from fastapi import APIRouter
# from app.models import query_engine
from llama_index.core import StorageContext, load_index_from_storage

from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import os
from dotenv import load_dotenv

router = APIRouter()

@router.get("/query-rag/{user_query}")
def query_rag(user_query: str):
    load_dotenv()

    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

    storage_context = StorageContext.from_defaults(persist_dir="rag_index")

    index = load_index_from_storage(storage_context, embed_model=embed_model)

    llm = HuggingFaceInferenceAPI(
        model_name="HuggingFaceH4/zephyr-7b-alpha", token=os.getenv('HF_API'),
    )

    query_engine = index.as_query_engine(llm=llm)
    response = query_engine.query(user_query)
    return {'message': response}