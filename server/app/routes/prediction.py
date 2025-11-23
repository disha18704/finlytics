from fastapi import APIRouter, HTTPException
from app.services.data_processing import fetch_and_process_ticker_data, ticker_encoded, normalize
from app.services.prediction import create_sequence, get_tft_predictions, scaling_predictions, storing_predictions
from app.services.news_scraping import scrape_news, add_recent_news
from app.services.sentiment_analysis import news_sentiment
from app.models.lstm_model import model
from app.models.tft_model import best_tft
from app.models import TickerRequest
import traceback
import pandas as pd

router = APIRouter()

@router.post("/predict-prices/")
async def predict_prices(request: TickerRequest):
    try:
        print(f"1. Fetching data for {request.ticker}...")
        raw_data = fetch_and_process_ticker_data(
            ticker=request.ticker,
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval
        )
        
        # DEBUG: Check if we got data
        if raw_data.empty:
            raise ValueError("Fetched data is empty.")

        print("2. Data fetched. Shape:", raw_data.shape)

        # Ensure we have enough data for the model (LSTM usually needs 60)
        if len(raw_data) < 60:
            raise ValueError(f"Not enough data points. Got {len(raw_data)}, need at least 60. Increase your date range.")

        raw_data = raw_data.tail(60)
        
        # --- FIX: HANDLE DATE COLUMN SAFELY ---
        # Do NOT use reset_index() blindly. It crashes if 'timestamp' exists.
        
        # If 'timestamp' is already a column, just rename it to 'date'
        if 'timestamp' in raw_data.columns:
            raw_data.rename(columns={"timestamp": "date"}, inplace=True)
        else:
            # Only reset index if we strictly have to
            raw_data.reset_index(inplace=True)
            raw_data.rename(columns={"index": "date", "Date": "date"}, inplace=True)
        # --------------------------------------
        
        print("3. Encoding ticker...")
        raw_data = ticker_encoded(raw_data)
        temp_df = raw_data.copy()
        
        print("4. Normalizing...")
        normalized_data, scaler = normalize(raw_data)
        
        # Handle ticker column drop safely
        if 'ticker' in normalized_data.columns:
            normalized_data = normalized_data.drop(columns=['ticker'])
        
        print("5. Creating sequences...")
        sequences, _, dates, stock = create_sequence(normalized_data)
        
        print("6. Running LSTM Prediction...")
        combined_dataset_prediction = model.predict(sequences)
        combined_dataset_prediction_inverse = scaling_predictions(scaler, combined_dataset_prediction)
        
        lstm_pred_df = storing_predictions(temp_df, dates, stock, combined_dataset_prediction_inverse)
        
        print("7. Fetching News...")
        news_df = scrape_news(ticker_name=request.ticker)
        combined_with_news_df = add_recent_news(lstm_pred_df, news_df)
        
        print("8. Sentiment Analysis...")
        sentiment_df = news_sentiment(combined_with_news_df)
        sentiment_df['time_idx'] = range(1, len(sentiment_df) + 1)
        
        print("9. TFT Prediction...")
        predicted_values = get_tft_predictions(sentiment_df)
        
        final_pred_open_price = predicted_values[0].item()
        final_pred_closing_price = predicted_values[1].item()
        
        print("✅ Success!")
        return {"open": final_pred_open_price, 'close': final_pred_closing_price}

    except Exception as e:
        print("❌ CRITICAL ERROR IN PREDICT ROUTE:")
        traceback.print_exc() # This prints the exact line number to your terminal
        raise HTTPException(status_code=500, detail=str(e))