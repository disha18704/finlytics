import numpy as np
from app.models.tft_model import best_tft

def create_sequence(dataset):
    sequences = []
    labels = []
    dates = []
    stock = []

    df_copy = dataset.drop(columns=["date"])

    start_idx = 0
    for stop_idx in range(20, len(dataset)):
        set_ = set(dataset.iloc[start_idx:stop_idx]["ticker_encoded"].values)
        target_day_ticker_class = dataset.iloc[stop_idx]["ticker_encoded"]

        if len(set_) == 1 and target_day_ticker_class == list(set_)[0]:
            sequences.append(df_copy.iloc[start_idx:stop_idx].values)
            labels.append(df_copy.iloc[stop_idx][["open", "adjclose"]])
            date_string = dataset.iloc[stop_idx]["date"].strftime('%Y-%m-%d')
            dates.append(date_string)
            stock.append(str(dataset.iloc[stop_idx]["ticker_encoded"]))

        start_idx += 1

    return np.array(sequences), np.array(labels), dates, stock

def scaling_predictions(price_scaler, combined_dataset_prediction):
    price_scaler.min_ = np.array([price_scaler.min_[0], price_scaler.min_[3]])
    price_scaler.scale_ = np.array([price_scaler.scale_[0], price_scaler.scale_[3]])
    combined_dataset_prediction_inverse = price_scaler.inverse_transform(combined_dataset_prediction)
    return combined_dataset_prediction_inverse

def storing_predictions(df, dates, stock, combined_dataset_prediction_inverse):
    df['pred_open'] = np.nan
    df['pred_closing'] = np.nan
    for idx, row in df.iterrows():
        current_row_date = row.date.strftime('%Y-%m-%d')
        current_row_ticker = str(row.ticker_encoded)
        for i in range(len(dates)):
            if current_row_date == dates[i] and stock[i] == current_row_ticker:
                opening_price = combined_dataset_prediction_inverse[i][0]
                closing_price = combined_dataset_prediction_inverse[i][1]
                df.loc[idx, 'pred_open'] = opening_price
                df.loc[idx, 'pred_closing'] = closing_price
                break
    df = df.dropna(subset=['pred_open', 'pred_closing']).reset_index(drop=True)
    return df

def get_tft_predictions(df):
    for i in range(1, 21):
        df[f'open_lag_{i}'] = df.groupby('ticker')['open'].shift(i)
        df[f'adjclose_lag_{i}'] = df.groupby('ticker')['adjclose'].shift(i)

    lag_columns = [f'open_lag_{i}' for i in range(
        1, 21)] + [f'adjclose_lag_{i}' for i in range(1, 21)]

    df.dropna(subset=lag_columns, inplace=True)

    predictions = best_tft.predict(df, mode="quantiles",trainer_kwargs={"accelerator": "cpu"})

    return predictions