from fastapi import APIRouter

from models.virhe import Virhe
from config.db import client
from schemas.virhe import virheEntity, virheetEntity
from bson import ObjectId
virhe = APIRouter()

@virhe.get('/virhe/')
async def find_all_virheet():
    print(client.hitsaus.virhe.find())
    print(virheetEntity(client.hitsaus.virhe.find()))
    return virheetEntity(client.hitsaus.virhe.find())

@virhe.get('/virhe/{id}')
async def get_virhe(id):
    return virheEntity(client.hitsaus.virhe.find_one({"_id":ObjectId(id)}))


@virhe.post('/virhe/')
async def create_virhe(virhe: Virhe):
    v = dict(virhe)
    v["Tarkastettu"] = "Ei"
    client.hitsaus.virhe.insert_one(v)
    return virheetEntity(client.hitsaus.virhe.find())

@virhe.put('/virhe/{id}')
async def update_virhe(id, virhe: Virhe):
    return virheEntity(client.hitsaus.virhe.find_one_and_update({"_id":ObjectId(id)}, {"$set":dict(virhe)}))

@virhe.delete('/virhe/{id}')
async def delete_virhe(id):
    return virheEntity(client.hitsaus.virhe.find_one_and_delete({"_id":ObjectId(id)}))

