def emailEntity(item) -> dict:
    return {
        "_id": str(item["_id"]),
        "tyyppi": str(item["tyyppi"]),
        "t_id": str(item["t_id"]),
        "emails": list(item["emails"])
        
    }

def emailsEntity(entity) -> list:
    return [emailEntity(item) for item in entity]