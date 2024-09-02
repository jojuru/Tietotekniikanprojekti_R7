from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from routes.user import user
from routes.virhe import virhe
from routes.email import email

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(user)
app.include_router(virhe)
app.include_router(email)

