import requests
import json as json
from requests.exceptions import HTTPError
import time
import asyncio
from azure.communication.email import EmailClient


# Azure EmailClient      
connection_string = ""
client = EmailClient.from_connection_string(connection_string)


# cd backend/mongo-api/
# source venv/scripts/activate
# uvicorn index:app --reload

while (True):
    # POST data, Check duplicates
    try:
            # Kaikki testi tiedostosta "json_data" 
            #file_obj = open("data.json", "r")
            #jsonContent = file_obj.read()
            #json_data = []
            #json_data = json.loads(jsonContent)
            #print()

            # Weldcubesta APi key
            url_ = ""
            welds = requests.get(url_, headers={'Accept': 'application/json'})
            jsonResponse = welds.json()
                    
            print("List of all weldings (State = not ok)")
            json_data = []

            for _data in jsonResponse['WeldInfos']:
                weld_state = (_data['State'])

                if weld_state == 'NotOk':
                     json_data.append(_data)

            print("Kaikki json data weldcubesta")
            print(type(json_data))
            print("Määrä: ", len(json_data))
            print()
        

            #with open("data.json", "w") as outfile:
            #       json.dump(json_data, outfile)

            # Kaikki tietokannasta "db_data"
            print("Kaikki virheet tietokannassa")
            url = "http://localhost:8000/virhe/"
            virheet = requests.get(url, headers={'Accept': 'application/json'})
            jsonResponse = virheet.json()
            db_data = []
            for _data in jsonResponse:
                db_data.append(_data)
            print(type(db_data))
            print("Määrä: ", len(db_data))
            print()


            # Duplikaatit poistetaan, listojen vertaus. Jos tietokanta on tyhjä -> lisätään kaikki, ilman tarkistusta
            if len(db_data) >  0:
                testi = []

                for i in json_data:
                    for d in db_data:
                        if d["Id"] == i["Id"]:
                            testi.append(i)
                
                lisattavat_virheet = [i for i in json_data if i not in testi]
                print()

                # Lähetettään virheilmoitukset sähköposteihin
                if len(lisattavat_virheet) > 0:

                    # Haetaan tietokannasta kaikki emailit
                    print("Kaikki sähköpostit")
                    url_get_email = "http://localhost:8000/email"
                    emails = requests.get(url_get_email, headers={'Accept': 'application/json'})
                    jsonResponse_email = emails.json()
                    email_data = []
                    for _data in jsonResponse_email:
                        email_data.append(_data)
                    print(type(email_data))
                    print("Määrä: ", len(email_data))
                    print()
                    
                    
                    # Jos tietokannassa enemmän kuin 0 sähköpostiosoitetta
                    if len(email_data) >  0:
                       
                        # Käydään data läpi, jos "email t_id" sekä haetun virheen "laiteId" on sama -> Lähetetään sähköpostit
                        for n in lisattavat_virheet:
                            for e in email_data:
                                if e["t_id"] == n["MachineSerialNumber"]:
                                    print("Sähköposteja löytyi")
                                    numero = n["MachineSerialNumber"]
                                    aika = n["Timestamp"]
                                    laite_tyyppi = n["MachineType"]
                                    osa_numero = n["PartSerialNumber"]
                                    pros_vaihe_num = n["ProcessingStepNumber"]
                                    lisatiedot = n["Details"]

            
                                    print("Laitteelle:", numero)
                                    print("Määrä: ", e["emails"])

                                    emails = (e["emails"])
                                    
                                    emails2 = [{"address": e} for e in emails]

                                    message = {
                                        "content": {
                                                "subject": "Virheilmoitus laitteesta %s" % numero,
                                                "plaintext":"Virheilmoituksen tiedot\n\nLaite:  %s\nTyyppi: %s\nAjankohta: %s\nOsan numero: %s\nProsessivaihe: %s\n\nLisätiedot: %s"  % (numero, laite_tyyppi, aika, osa_numero, pros_vaihe_num, lisatiedot)
                                                
                                            },
                                            "recipients": {
                                                "to": emails2
                                        },

                                        "senderAddress": "virheilmoitus@2221736f-a085-4c8d-a17c-d3796521af33.azurecomm.net"
                                    }
                                
                                    # Lähetetään virheilmoitus viesti sähköpostiin
                                    poller = client.begin_send(message)
                                    result = poller.result()    

                    else:
                        # Tietokannassa 0 sähköpostiosoitetta
                        print("Ei syötettyjä sähköposteja")
                                     
                else:
                    # Uusia virheitä ei ole
                    print("Ei lisättäviä virheitä")
                                                    
                print()
                print("Lisättävät virheet tietokantaan")
                print(type(lisattavat_virheet))
                print("Määrä: ", len(lisattavat_virheet))

                
                # Käydään lista läpi, lisätään arvo ""Tarkastettu": ""
                key = "Tarkastettu"
                value = ""
                for i in lisattavat_virheet:
                    i[key] = value    
            
                # Lisätään tietokantaan uudet virheet
                url3 = "http://localhost:8000/virhe/"
                for _data in lisattavat_virheet:
                    r = requests.post(url3, json = _data)

            elif len(db_data) == 0:

                # Käydään lista läpi, lisätään arvo ""Tarkastettu": ""
                key = "Tarkastettu"
                value = ""
                for i in json_data:
                    i[key] = value    

                url3 = "http://localhost:8000/virhe/"
                for _data in json_data:
                    r = requests.post(url3, json = _data)

            
    except HTTPError as http_err:
            print(f'HTTP error occured: {http_err}')
    except Exception as err:
            print(f'other error occured: {err}')

    print()
    print()


    # Poistetaan tietokannasta ylimääräiset virheet
    try:
            url = "http://localhost:8000/virhe/"
            virheet = requests.get(url, headers={'Accept': 'application/json'})
            jsonResponse = virheet.json()
            virheet_arr = []

            # KAIKKI DATA
            print("Kaikki virheet tietokannassa")
            for _data in jsonResponse:
                # print(_data)
                virheet_arr.append(_data)

            # MÄÄRÄ
            print("Virheiden määrä")
            length = len(jsonResponse)
            print(length)
            
            # YLIMÄÄRÄISET VIRHEET
            x = 200
            print()
            id_lista = []
            print('Poistettavat/Ylimääräiset virheet')

            # Jos määrä on yli 200 määrä, poistetaan ylim
            if length > x:
                # Poistaa lopusta
                #ylim_lkm = x - length
                #k = length - (-ylim_lkm)
                #re = virheet_arr[: len(virheet_arr) - k]

                # Otetaan id:t
                #print()
                #print("Ylimääräiset virheet")
                #print("")
                #id = [i["_id"] for i in re]
                #print('Poistettavien virheiden määrä: ', len(id))
                #print(id)


                # Poistaa alusta, vanhimman
                lista = []
                n = x - length
                for i in range(-(n)):
                    lista.append(virheet_arr[n + i])
                id = [i["_id"] for i in lista]
                print('Poistettavien virheiden määrä: ', len(id))
                print(id)

                # DELETE
                try:
                    for id in id:
                        url = 'http://localhost:8000/virhe/' + id
                        r = requests.delete(url)
                        print("Poistetaan ylimääräiset virheet")
                        print(f'Status code: {r.status_code}')

                except HTTPError as http_err:
                        print(f'HTTP error occured: {http_err}')
                except Exception as err:
                        print(f'other error occured: {err}')
                
            else:
                print("Ei poistettavaa, määrä on ≤", x)

    except HTTPError as http_err:
        print(f'HTTP error occured: {http_err}')

    except Exception as err:
        print(f'other error occured: {err}')

    time.sleep(30)




