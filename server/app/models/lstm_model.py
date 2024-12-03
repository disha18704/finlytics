import tensorflow as tf

MODEL_PATH = "model_artifacts/20_lstm_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)