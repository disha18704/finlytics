import pandas as pd
import yfinance as yf
from fastapi import HTTPException
from sklearn.preprocessing import MinMaxScaler

import pandas as pd
import yfinance as yf
from fastapi import HTTPException

def fetch_and_process_ticker_data(ticker, start_date, end_date, interval="1d"):
    df = pd.DataFrame()
    try:
        print(f"Downloading {ticker}...")
        
        # 1. Download Data
        temp = yf.download(
            ticker, 
            start=start_date, 
            end=end_date, 
            interval=interval, 
            progress=False, 
            auto_adjust=False
        )
        
        if temp.empty:
            raise ValueError(f"No data found for ticker {ticker}.")

        # 2. Fix MultiIndex (Flatten columns)
        if isinstance(temp.columns, pd.MultiIndex):
            temp.columns = temp.columns.get_level_values(0)

        # 3. Reset Index
        temp.reset_index(inplace=True)

        # 4. Rename Date column safely
        date_col = None
        for col in temp.columns:
            if str(col).lower() == 'date':
                date_col = col
                break
        
        if date_col:
            temp.rename(columns={date_col: 'timestamp'}, inplace=True)
        else:
            temp.rename(columns={temp.columns[0]: 'timestamp'}, inplace=True)

        # 5. FORCE Timestamp Format
        temp['timestamp'] = pd.to_datetime(temp['timestamp'], errors='coerce')
        temp = temp.dropna(subset=['timestamp'])

        # 6. Clean headers
        temp.columns = temp.columns.str.lower().str.replace(" ", "")
        temp['ticker'] = ticker

        # 7. Feature Engineering
        adj_close = temp.get("adjclose", temp.get("close"))
        temp["revenue"] = adj_close * temp["volume"]
        temp["daily_profit"] = adj_close - temp["open"]
        
        if "close" in temp.columns:
            temp = temp.drop(columns="close")
            
        df = pd.concat([df, temp], axis=0)
        
        # --- THE NUCLEAR FIX ---
        # We do NOT use set_index() anymore. 
        # We manually assign the index. This is crash-proof.
        if 'timestamp' in df.columns:
            df.index = pd.DatetimeIndex(df['timestamp'])
            df.sort_index(inplace=True)
        # -----------------------

        df.to_csv("api_test.csv", index=False)  
        
    except Exception as error:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing ticker {ticker}: {str(error)}")
    
    return df

def ticker_encoded(df):
    df['ticker_encoded'] = df['ticker'].astype('category').cat.codes
    return df

def normalize(df):
    price_scaler = MinMaxScaler()
    volume_revenue_scaler = MinMaxScaler()
    profit_scaler = MinMaxScaler()

    price_cols = ["open", "high", "low", "adjclose"]
    
    if all(c in df.columns for c in price_cols):
        df[price_cols] = price_scaler.fit_transform(df[price_cols])
        
    df[["volume", "revenue"]] = volume_revenue_scaler.fit_transform(df[["volume", "revenue"]])
    df[["daily_profit"]] = profit_scaler.fit_transform(df[["daily_profit"]])

    return df, price_scaler