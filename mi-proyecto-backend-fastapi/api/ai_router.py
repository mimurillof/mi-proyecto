from fastapi import APIRouter

router = APIRouter()

# Placeholder for AI agent routes
@router.post("/chat")
async def chat_with_agent():
    return {"message": "Chat with AI agent endpoint"}

@router.post("/predict")
async def predict_trend():
    return {"message": "Predict trend endpoint"} 