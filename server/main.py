from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Allow requests from frontend
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
async def get_status():
    return {
        "logic": 85,
        "memory": 90,
        "attention": 78,
        "orientation": 92
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
