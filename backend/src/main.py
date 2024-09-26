from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import api_router

PORT = 8000

app = FastAPI(
    title="Horizonts",
    description="Horizonts API",
    version="0.5.1",
    servers=[{"url": f"http://173.17.10.123:{PORT}"}],
)

allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
