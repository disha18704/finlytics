import torch

print('torch:', torch.__version__)
print('CUDA:', torch.cuda.is_available())
print('MPS:', torch.backends.mps.is_available()) 

if torch.backends.mps.is_available():
    mps_device = torch.device("mps")
    x = torch.ones(1, device=mps_device)
    print (x)
else:
    print ("MPS device not found.")