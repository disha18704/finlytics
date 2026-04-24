from fastapi import APIRouter, HTTPException
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.memory import ChatMemoryBuffer
import os
import re
import pandas as pd
from datetime import date, timedelta
from typing import Optional, Dict, List, Tuple
from dotenv import load_dotenv
from app.models import QueryRequest
from app.services.data_processing import fetch_and_process_ticker_data


router = APIRouter()
_COMMON_NON_TICKER_WORDS = {
    "TOP", "THE", "AND", "FOR", "WITH", "FROM", "THAT", "THIS", "WHAT", "SHOW",
    "STOCK", "STOCKS", "PRICE", "PRICES", "TODAY", "LATEST", "ABOUT", "MICROCAP",
    "GROWTH", "REVENUE", "MOMENTUM", "TREND", "PREDICT", "PREDICTION", "BUY",
}
_TICKER_UNIVERSE = ["ATOM", "HBIO", "NATH", "MYFW", "IBEX"]
_COMPANY_TO_TICKER = {
    "atomera": "ATOM",
    "atomera incorporated": "ATOM",
    "atomera energy": "ATOM",
    "harvard bioscience": "HBIO",
    "harvard bioscience inc": "HBIO",
    "nathans famous": "NATH",
    "nathan's famous": "NATH",
    "first western financial": "MYFW",
    "first western financial inc": "MYFW",
    "ibex": "IBEX",
    "ibex limited": "IBEX",
}

def _build_query_engine():
    load_dotenv()
    api_key = os.getenv("HF_API")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="HF_API is not configured on the backend.",
        )

    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
    storage_context = StorageContext.from_defaults(persist_dir="rag_index")
    index = load_index_from_storage(storage_context, embed_model=embed_model)

    llm = HuggingFaceInferenceAPI(
        model="HuggingFaceH4/zephyr-7b-beta",
        token=api_key,
        provider="featherless-ai",
    )
    memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

    return index.as_chat_engine(
        chat_mode="condense_question",
        memory=memory,
        llm=llm,
        verbose=True,
    )

QUERY_ENGINE = _build_query_engine()


def _sanitize_message(text: str) -> str:
    cleaned = (text or "").replace("undefined", "").strip()
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned or "I could not generate a reliable answer from the current context."


def _format_ranked_response(title: str, rows: List[Tuple[str, float, str]], total_tickers: int) -> str:
    lines = [title, ""]
    for idx, (ticker, value, reason) in enumerate(rows, start=1):
        lines.append(f"{idx}. {ticker} - {value:.2f}% ({reason})")
    if not rows:
        lines.append("No tickers could be ranked from live data right now.")
    lines.append("")
    lines.append(f"Ranked from {total_tickers} live ticker(s).")
    return "\n".join(lines)


def _compute_metrics_for_ticker(ticker: str, lookback_days: int = 180) -> Optional[Dict[str, float]]:
    end = date.today()
    start = end - timedelta(days=lookback_days)
    try:
        df = fetch_and_process_ticker_data(
            ticker=ticker,
            start_date=start.isoformat(),
            end_date=end.isoformat(),
            interval="1d",
        )
    except Exception:
        return None

    if df is None or df.empty:
        return None

    # `fetch_and_process_ticker_data` sets timestamp as both index and column.
    # Reset index to avoid pandas ambiguity when sorting by the timestamp column.
    frame = df.reset_index(drop=True).sort_values("timestamp").copy()
    first = frame.iloc[0]
    latest = frame.iloc[-1]

    first_revenue = float(first.get("revenue", 0.0))
    latest_revenue = float(latest.get("revenue", 0.0))
    revenue_growth = 0.0 if abs(first_revenue) < 1e-9 else ((latest_revenue - first_revenue) / abs(first_revenue)) * 100.0

    first_close = float(first.get("adjclose", first.get("open", 0.0)))
    latest_close = float(latest.get("adjclose", latest.get("open", 0.0)))
    momentum = 0.0 if abs(first_close) < 1e-9 else ((latest_close - first_close) / abs(first_close)) * 100.0

    return {
        "revenue_growth": revenue_growth,
        "momentum": momentum,
        "latest_close": latest_close,
    }


def _rank_universe(metric_key: str, title: str) -> str:
    rows: List[Tuple[str, float, str]] = []
    for ticker in _TICKER_UNIVERSE:
        metrics = _compute_metrics_for_ticker(ticker)
        if metrics is None:
            continue
        metric_value = float(metrics[metric_key])
        rows.append((ticker, metric_value, "computed from live ~6 month market data"))

    rows.sort(key=lambda x: x[1], reverse=True)
    return _format_ranked_response(title, rows[:5], len(rows))


def _extract_ticker_from_query(query: str) -> Optional[str]:
    normalized_query = query.lower()
    for company_name, ticker in _COMPANY_TO_TICKER.items():
        if company_name in normalized_query:
            return ticker

    candidates = re.findall(r"\b\$?([A-Za-z]{1,5})\b", query)
    for token in candidates:
        upper = token.upper()
        if upper not in _COMMON_NON_TICKER_WORDS:
            return upper
    return None


def _extract_tickers_from_query(query: str) -> List[str]:
    tickers: List[str] = []
    normalized_query = query.lower()
    for company_name, ticker in _COMPANY_TO_TICKER.items():
        if company_name in normalized_query and ticker not in tickers:
            tickers.append(ticker)

    token_candidates = re.findall(r"\b\$?([A-Za-z]{1,5})\b", query)
    for token in token_candidates:
        upper = token.upper()
        if upper in _COMMON_NON_TICKER_WORDS:
            continue
        if upper in _TICKER_UNIVERSE and upper not in tickers:
            tickers.append(upper)

    return tickers


def _is_live_market_query(query: str) -> bool:
    q = query.lower()
    keywords = [
        "price", "open", "high", "low", "close", "volume", "trend",
        "today", "latest", "moving", "change", "return", "performance",
    ]
    return any(word in q for word in keywords)


def _answer_compare_query(query: str) -> Optional[str]:
    normalized = query.lower()
    if "compare" not in normalized and "vs" not in normalized:
        return None

    tickers = _extract_tickers_from_query(query)[:2]
    if len(tickers) < 2:
        return "Please specify two tickers or company names to compare, for example: 'Compare ATOM vs HBIO'."

    metrics_a = _compute_metrics_for_ticker(tickers[0])
    metrics_b = _compute_metrics_for_ticker(tickers[1])
    if not metrics_a or not metrics_b:
        return "I could not fetch enough live data to compare those two tickers right now."

    return (
        f"Live comparison ({tickers[0]} vs {tickers[1]}):\n\n"
        f"- Revenue growth: {metrics_a['revenue_growth']:.2f}% vs {metrics_b['revenue_growth']:.2f}%\n"
        f"- Price momentum: {metrics_a['momentum']:.2f}% vs {metrics_b['momentum']:.2f}%\n"
        f"- Latest close: ${metrics_a['latest_close']:.2f} vs ${metrics_b['latest_close']:.2f}"
    )


def _answer_live_market_query(query: str) -> Optional[str]:
    ticker = _extract_ticker_from_query(query)
    if not ticker or not _is_live_market_query(query):
        return None

    end = date.today()
    start = end - timedelta(days=180)
    try:
        df = fetch_and_process_ticker_data(
            ticker=ticker,
            start_date=start.isoformat(),
            end_date=end.isoformat(),
            interval="1d",
        )
    except Exception:
        return f"I could not fetch live market data for `{ticker}` right now. Please try again in a moment."

    if df is None or df.empty:
        return f"No live market data found for `{ticker}` in the selected time range."

    # `fetch_and_process_ticker_data` sets timestamp as both index and column.
    # Reset index to avoid pandas ambiguity when sorting by the timestamp column.
    frame = df.reset_index(drop=True).sort_values("timestamp").copy()
    latest = frame.iloc[-1]
    first = frame.iloc[0]
    latest_close = float(latest.get("adjclose", latest.get("open", 0.0)))
    first_close = float(first.get("adjclose", latest_close))
    change_pct = 0.0 if abs(first_close) < 1e-9 else ((latest_close - first_close) / abs(first_close)) * 100.0
    avg_volume = float(frame["volume"].tail(20).mean()) if "volume" in frame.columns else 0.0

    return (
        f"Live market snapshot for {ticker} (last ~6 months):\n\n"
        f"- Latest close: ${latest_close:.2f}\n"
        f"- Period change: {change_pct:.2f}%\n"
        f"- Latest high / low: ${float(latest.get('high', 0.0)):.2f} / ${float(latest.get('low', 0.0)):.2f}\n"
        f"- Latest open: ${float(latest.get('open', 0.0)):.2f}\n"
        f"- Avg volume (20d): {avg_volume:,.0f}\n\n"
        "Ask a follow-up like 'show short-term trend for this ticker' or 'compare with another ticker'."
    )


@router.post("/query-rag")
def query_rag(request: QueryRequest):
    user_query = request.query.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # Simple greeting path prevents odd RAG retrieval responses for "hey/hi".
    if user_query.lower() in {"hi", "hello", "hey"}:
        return {
            "message": (
                "Hi! I can help with microcap stock analysis. "
                "Try asking: 'Top 5 microcap stocks by revenue growth in the dataset'."
            )
        }

    normalized_query = user_query.lower()
    if "top" in normalized_query and "revenue" in normalized_query and "growth" in normalized_query:
        return {"message": _rank_universe("revenue_growth", "Top tickers by revenue growth:")}
    if "top" in normalized_query and "momentum" in normalized_query:
        return {"message": _rank_universe("momentum", "Top tickers by price momentum:")}
    compare_answer = _answer_compare_query(user_query)
    if compare_answer:
        return {"message": _sanitize_message(compare_answer)}
    live_answer = _answer_live_market_query(user_query)
    if live_answer:
        return {"message": _sanitize_message(live_answer)}

    full_query = (
        "You are FinBot, a helpful microcap-stock assistant. "
        "Return clean markdown only. No code blocks. No 'undefined'. "
        "For ranking questions, return exactly 5 unique stocks with ticker and one-line reason each. "
        "If context is weak or incomplete, say that clearly and ask a focused follow-up question.\n\n"
        f"Conversation context:\n{request.conversation_context}\n\n"
        f"User question:\n{user_query}"
    )
    response = QUERY_ENGINE.chat(full_query)
    return {"message": _sanitize_message(str(response))}


@router.get("/query-rag/{user_query}")
def query_rag_legacy(user_query: str):
    return query_rag(QueryRequest(query=user_query))