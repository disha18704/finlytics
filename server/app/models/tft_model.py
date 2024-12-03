from pytorch_forecasting import TemporalFusionTransformer

best_model_path = 'model_artifacts/tft_pred.ckpt'
best_tft = TemporalFusionTransformer.load_from_checkpoint(best_model_path, map_location='cpu')