from fastapi import APIRouter, HTTPException
from app.services.data_processing import fetch_and_process_ticker_data
from app.models import TickerRequest

router = APIRouter()

@router.post("/fetch-ticker-data/")
async def fetch_ticker_data(request: TickerRequest):
    try:
        result_df = fetch_and_process_ticker_data(
            ticker=request.ticker,
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval
        )
        return result_df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))