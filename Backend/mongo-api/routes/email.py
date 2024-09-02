from fastapi import APIRouter

from models.email import Email
from config.db import client
from schemas.email import emailEntity, emailsEntity
from bson import ObjectId
email = APIRouter()

@email.get('/email')
async def find_all_emails():
    print(client.hitsaus.email.find())
    print(emailsEntity(client.hitsaus.email.find()))
    return emailsEntity(client.hitsaus.email.find())

@email.post('/email/')
async def create_email(email: Email):
    el = emailsEntity(client.hitsaus.email.find())
    t = False
    upd = object
    for item in el:
        if item["t_id"] == dict(email)["t_id"]:
            t = True
            upd = dict(item)
            upd = dict(upd)
            dict(email)["emails"].extend(upd["emails"])
            client.hitsaus.email.find_one_and_update({"_id":ObjectId(upd["_id"])}, {"$set":{"emails": dict(email)["emails"]}})
            break
    if not t:
        client.hitsaus.email.insert_one(dict(email))
    t = False
  
@email.delete('/email/{id}')
async def delete_email(id):
    return emailEntity(client.hitsaus.email.find_one_and_delete({"_id":ObjectId(id)}))

    
    