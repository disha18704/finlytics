import pandas as pd
from yahoo_fin.stock_info import get_data
from fastapi import HTTPException

def fetch_and_process_ticker_data(ticker, start_date, end_date, interval="1d"):
    df = pd.DataFrame()
    try:
        temp = get_data(ticker, start_date=start_date, end_date=end_date, index_as_date=True, interval=interval)
        temp = temp.drop(columns="close")
        temp["revenue"] = temp["adjclose"] * temp["volume"]
        temp["daily_profit"] = temp["adjclose"] - temp["open"]
        df = pd.concat([df, temp], axis=0)
        df.to_csv("api_test.csv", index=False)  # Save locally for reference
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error processing ticker {ticker}: {error}")
    return df

def ticker_encoded(df):
    label_map = {'ATOM': 0, 'HBIO': 1, 'IBEX': 2, 'MYFW': 3, 'NATH': 4}
    ticker_encoded = []
    for i in df.iloc():
        ticker_name = i['ticker']
        encoded_ticker = label_map[ticker_name]
        ticker_encoded.append(encoded_ticker)
    df['ticker_encoded'] = ticker_encoded
    return df

def normalize(df):
    from sklearn.preprocessing import MinMaxScaler
    price_scaler = MinMaxScaler()
    volume_revenue_scaler = MinMaxScaler()
    profit_scaler = MinMaxScaler()

    df[["open", "high", "low", "adjclose"]] = price_scaler.fit_transform(df[["open", "high", "low", "adjclose"]])
    df[["volume", "revenue"]] = volume_revenue_scaler.fit_transform(df[["volume", "revenue"]])
    df[["daily_profit"]] = profit_scaler.fit_transform(df[["daily_profit"]])

    return df, price_scaler