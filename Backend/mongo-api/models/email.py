from pydantic import BaseModel

class Email(BaseModel):
    tyyppi: str
    t_id: str
    emails: list
    