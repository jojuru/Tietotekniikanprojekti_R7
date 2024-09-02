from pydantic import BaseModel

class Virhe(BaseModel):
    Id: str 
    Timestamp: str
    ProcessingStepNumber: str 
    PartSerialNumber: str 
    PartArticleNumber: str 
    MachineType: str 
    MachineSerialNumber: str 
    Details: str
    State: str 
    Welder: str
    Tarkastettu: str