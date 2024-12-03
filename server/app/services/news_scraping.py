import pandas as pd
import requests
from bs4 import BeautifulSoup

def scrape_news(ticker_name):
    columns = ['datatime', 'title', 'source', 'link', 'top_sentiment', 'sentiment_score']
    df = pd.DataFrame(columns=columns)
    for i in range(1, 3):
        url = f'https://markets.businessinsider.com/news/{ticker_name}-stock?p={i}'
        response = requests.get(url)
        html = response.text
        soup = BeautifulSoup(html, 'lxml')
        articles = soup.find_all('div', class_='latest-news__story')
        for article in articles:
            datatime = article.find('time', class_='latest-news__date').get('datetime')
            title = article.find('a', class_='news-link').text
            source = article.find('span', class_='latest-news__source').text
            link = article.find('a', class_='news-link').get('href')
            top_sentiment = ''
            sentiment_score = 0
            temp = pd.DataFrame([[datatime, title, source, link, top_sentiment, sentiment_score]], columns=df.columns)
            df = pd.concat([temp, df], axis=0)
    return df

def add_recent_news(main_df, news_df, lookback_days=10):
    news_df.drop(columns=['top_sentiment', 'sentiment_score'], inplace=True)
    main_df['date'] = pd.to_datetime(main_df['date'])
    news_df['datatime'] = pd.to_datetime(news_df['datatime'])
    news_list = []
    last_available_news = ''
    for _, row in main_df.iterrows():
        current_date = row['date']
        current_ticker = row['ticker']
        news_articles = ''
        for _, news_row in news_df.iterrows():
            extracted_date = news_row['datatime']
            if (current_date - extracted_date).days <= lookback_days and extracted_date < current_date:
                news_articles += news_row['title'] + " "
        if not news_articles.strip():
            for _, news_row in news_df[::-1].iterrows():
                if news_row['datatime'] < current_date:
                    news_articles = news_row['title']
                    break
        last_available_news = news_articles.strip() or last_available_news
        news_list.append(last_available_news)
    main_df['news'] = news_list
    return main_df