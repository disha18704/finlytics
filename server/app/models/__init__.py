from pydantic import BaseModel

class TickerRequest(BaseModel):
    ticker: str
    start_date: str
    end_date: str
    interval: str = "1d"    