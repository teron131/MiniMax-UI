import logging
import os
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .config import config

# Initialize FastAPI app
app = FastAPI(
    title=config.APP_NAME,
    description="Text-to-Speech API using MiniMax",
    version="0.1.0",
    debug=config.DEBUG_MODE,
)

# CORS middleware
if config.ENABLE_CORS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Serve static files
app.mount("/static", StaticFiles(directory=config.STATIC_DIR), name="static")


# Pydantic models
class TTSRequest(BaseModel):
    model: str = Field(default="speech-02-hd", description="TTS model to use")
    text: str = Field(..., description="Text to synthesize")
    voice_id: str = Field(default="Wise_Woman", description="Voice ID")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Speech speed")
    emotion: Optional[str] = Field(default=None, description="Emotion setting")
    language_boost: Optional[str] = Field(default="Chinese,Yue", description="Language boost setting")
    volume: float = Field(default=1.0, gt=0.0, le=10.0, description="Volume level")
    pitch: float = Field(default=0.0, ge=-12.0, le=12.0, description="Pitch adjustment")


class TTSResponse(BaseModel):
    status: str
    message: str
    audio_data: Optional[str] = None
    trace_id: Optional[str] = None


def success_response(message: str, data: dict = None) -> dict:
    """Standard success response format."""
    response = {"status": "success", "message": message}
    if data:
        response.update(data)
    return response


def error_response(message: str, status_code: int = 400) -> dict:
    """Standard error response format."""
    return {"status": "error", "message": message, "status_code": status_code}


@app.get("/")
async def root():
    """API info endpoint."""
    return {"app": config.APP_NAME, "description": "Text-to-Speech API using MiniMax", "version": "0.1.0", "frontend_url": "http://localhost:3000", "api_docs": "/docs"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": config.APP_NAME}


@app.post("/api/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using MiniMax API."""
    try:
        # Validate API configuration
        if not config.MINIMAX_GROUP_ID or not config.MINIMAX_API_KEY:
            raise HTTPException(status_code=500, detail="MiniMax API credentials not configured")

        # Prepare MiniMax API request
        url = f"{config.MINIMAX_BASE_URL}/t2a_v2?GroupId={config.MINIMAX_GROUP_ID}"

        payload = {
            "model": request.model,
            "text": request.text,
            "stream": False,
            "voice_setting": {"voice_id": request.voice_id, "speed": request.speed, "vol": int(request.volume), "pitch": int(request.pitch)},
            "audio_setting": {"sample_rate": config.DEFAULT_SAMPLE_RATE, "format": config.DEFAULT_FORMAT, "channel": config.DEFAULT_CHANNEL},
        }

        # Add optional parameters
        if request.emotion:
            payload["voice_setting"]["emotion"] = request.emotion
        if request.language_boost:
            payload["language_boost"] = request.language_boost

        headers = {"Authorization": f"Bearer {config.MINIMAX_API_KEY}", "Content-Type": "application/json"}

        # Make API request
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)

        trace_id = response.headers.get("Trace-Id")

        if response.status_code != 200:
            logging.error(f"MiniMax API error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"MiniMax API error: {response.text}")

        data = response.json()

        if data and "data" in data and "audio" in data["data"]:
            return TTSResponse(status="success", message="Text converted to speech successfully", audio_data=data["data"]["audio"], trace_id=trace_id)
        else:
            raise HTTPException(status_code=500, detail="Invalid response from MiniMax API")

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timeout")
    except httpx.RequestError as e:
        logging.error(f"Request error: {e}")
        raise HTTPException(status_code=500, detail="Network error")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/voices")
async def get_available_voices():
    """Get list of available voice IDs."""
    voices = [
        {"id": "Wise_Woman", "name": "Wise Woman", "language": "English"},
        {"id": "Friendly_Person", "name": "Friendly Person", "language": "English"},
        {"id": "Inspirational_girl", "name": "Inspirational Girl", "language": "English"},
        {"id": "Deep_Voice_Man", "name": "Deep Voice Man", "language": "English"},
        {"id": "Calm_Woman", "name": "Calm Woman", "language": "English"},
        {"id": "Casual_Guy", "name": "Casual Guy", "language": "English"},
        {"id": "Lively_Girl", "name": "Lively Girl", "language": "English"},
        {"id": "Patient_Man", "name": "Patient Man", "language": "English"},
        {"id": "Young_Knight", "name": "Young Knight", "language": "English"},
        {"id": "Determined_Man", "name": "Determined Man", "language": "English"},
        {"id": "Lovely_Girl", "name": "Lovely Girl", "language": "English"},
        {"id": "Decent_Boy", "name": "Decent Boy", "language": "English"},
        {"id": "Imposing_Manner", "name": "Imposing Manner", "language": "English"},
        {"id": "Elegant_Man", "name": "Elegant Man", "language": "English"},
        {"id": "Abbess", "name": "Abbess", "language": "English"},
        {"id": "Sweet_Girl_2", "name": "Sweet Girl 2", "language": "English"},
        {"id": "Exuberant_Girl", "name": "Exuberant Girl", "language": "English"},
    ]
    return success_response("Available voices retrieved", {"voices": voices})


@app.get("/api/models")
async def get_available_models():
    """Get list of available TTS models."""
    models = [
        {"id": "speech-02-hd", "name": "Speech 02 HD", "quality": "high"},
        {"id": "speech-02-turbo", "name": "Speech 02 Turbo", "quality": "fast"},
        {"id": "speech-01-hd", "name": "Speech 01 HD", "quality": "high"},
        {"id": "speech-01-turbo", "name": "Speech 01 Turbo", "quality": "fast"},
    ]
    return success_response("Available models retrieved", {"models": models})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.app:app",
        host=config.SERVER_HOST,
        port=config.SERVER_PORT,
        reload=config.DEBUG_MODE,
    )
