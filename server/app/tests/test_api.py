import requests

def test_fetch_ticker_data():
    url = "http://localhost:8000/fetch-ticker-data/"
    data = {
        "ticker": "HBIO",
        "start_date": "2023-01-01",
        "end_date": "2023-12-31",
        "interval": "1d"
    }
    
    response = requests.post(url, json=data)
    print("Fetch Ticker Data Response:", response.json())
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

def test_predict_prices():
    url = "http://localhost:8000/predict-prices/"
    data = {
        'ticker': "HBIO",
        'start_date': "2024-08-03",
        'end_date': "2024-11-13"
    }
    
    response = requests.post(url, json=data)
    print("Predict Prices Response:", response.json())
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

def test_query():
     url = "http://localhost:8000/query-rag/what is this 10k document about? Harvard Bio Science/"
     
     response = requests.get(url)
     print("Query Response:", response.json())
     assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

if __name__ == "__main__":
    test_fetch_ticker_data()
    test_predict_prices()
    test_query()
    