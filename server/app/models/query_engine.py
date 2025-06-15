from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import os
from dotenv import load_dotenv

def initialize_query_engine():
    load_dotenv()
    
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
    storage_context = StorageContext.from_defaults(persist_dir="rag_index")
    index = load_index_from_storage(storage_context, embed_model=embed_model)
    
    llm = HuggingFaceInferenceAPI(
        model_name="HuggingFaceH4/zephyr-7b-beta", 
        token=os.getenv('HF_API'),
    )
    
    return index.as_query_engine(llm=llm)

query_engine = initialize_query_engine()