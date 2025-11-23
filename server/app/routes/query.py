from fastapi import APIRouter
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.memory import ChatMemoryBuffer
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
        model="HuggingFaceH4/zephyr-7b-beta", token=os.getenv('HF_API'), 
        provider="featherless-ai",
    )

    # 4. Setup Memory
    memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
    
    query_engine= index.as_chat_engine(
        chat_mode="condense_question", 
        memory=memory,
        llm=llm,
        verbose=True
    )

    response = query_engine.chat(user_query)
    
    return {'message': str(response)}