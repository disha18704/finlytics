import torch
import pandas as pd
from app.models.sentiment_model import tokenizer, sentiment_model

def news_sentiment(df):
    news_column_name = 'news'
    texts = df[news_column_name].tolist()
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = sentiment_model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=-1)
    labels = ["negative", "neutral", "positive"]
    predictions = torch.argmax(probs, dim=-1)
    df['predicted_sentiment'] = pd.Series([labels[pred] for pred in predictions], index=df[df[news_column_name].notna()].index)
    sentiment_map = {'positive': 1, 'neutral': 0, 'negative': -1}
    df['sentiment_score'] = df['predicted_sentiment'].map(sentiment_map)
    df = df.drop(columns=['news'])
    return df