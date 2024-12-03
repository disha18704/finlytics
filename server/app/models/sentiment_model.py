from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name_news = "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name_news)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(model_name_news)