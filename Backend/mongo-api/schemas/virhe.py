def virheEntity(item) -> dict:
    return {
        "_id": str(item["_id"]),
        "Id": str(item["Id"]),
        "Timestamp": str(item["Timestamp"]),
        "ProcessingStepNumber": str(item["ProcessingStepNumber"]),
        "PartSerialNumber": str(item["PartSerialNumber"]),
        "PartArticleNumber": str(item["PartArticleNumber"]),
        "MachineType": str(item["MachineType"]),
        "MachineSerialNumber": str(item["MachineSerialNumber"]), 
        "Details": str(item["Details"]),
        "State": str(item["State"]),
        "Welder": str(item["Welder"]),
        "Tarkastettu": str(item["Tarkastettu"])
    }

def virheetEntity(entity) -> list:
    return [virheEntity(item) for item in entity]