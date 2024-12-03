from fastapi import APIRouter, HTTPException
from app.services.data_processing import fetch_and_process_ticker_data, ticker_encoded, normalize
from app.services.prediction import create_sequence, get_tft_predictions, scaling_predictions, storing_predictions
from app.services.news_scraping import scrape_news, add_recent_news
from app.services.sentiment_analysis import news_sentiment
from app.models.lstm_model import model
from app.models.tft_model import best_tft
from app.models import TickerRequest

router = APIRouter()

@router.post("/predict-prices/")
async def predict_prices(request: TickerRequest):
    try:
        raw_data = fetch_and_process_ticker_data(
            ticker=request.ticker,
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval
        )
        raw_data = raw_data.tail(60)
        raw_data = raw_data.reset_index()
        raw_data.rename(columns={"index": "date"}, inplace=True)
        raw_data = ticker_encoded(raw_data)
        temp_df = raw_data.copy()
        normalized_data, scaler = normalize(raw_data)
        normalized_data = normalized_data.drop(columns=['ticker'])
        sequences, _, dates, stock = create_sequence(normalized_data)
        combined_dataset_prediction = model.predict(sequences)
        combined_dataset_prediction_inverse = scaling_predictions(scaler, combined_dataset_prediction)
        lstm_pred_df = storing_predictions(temp_df, dates, stock, combined_dataset_prediction_inverse)
        news_df = scrape_news(ticker_name=request.ticker)
        combined_with_news_df = add_recent_news(lstm_pred_df, news_df)
        sentiment_df = news_sentiment(combined_with_news_df)
        sentiment_df['time_idx'] = range(1, len(sentiment_df) + 1)
        predicted_values = get_tft_predictions(sentiment_df)
        final_pred_open_price = predicted_values[0].item()
        final_pred_closing_price = predicted_values[1].item()
        return {"open": final_pred_open_price, 'close': final_pred_closing_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))