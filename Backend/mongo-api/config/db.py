import pymongo

conn_str = ""

client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
#try:


#    print(client.server_info())
#except Exception:
#    print("Unable to connect to the server.")