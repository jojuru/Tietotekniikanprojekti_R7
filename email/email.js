const { EmailClient } = require("@azure/communication-email");

const connectionString =
  "azure access key";

const client = new EmailClient(connectionString);

//Viesti maksaa jonkun sentin azuressa niin katsokaa ettette aja koodia vahingossa tuhansia kertoja. :D
const message = {
  senderAddress:
    "virheilmoitus@2221736f-a085-4c8d-a17c-d3796521af33.azurecomm.net",
  content: {
    subject: "Tämä on aihe",
    plainText: "Tämä on viesti",
  },
  recipients: {
    to: [
      {
        address: "Sähköposti osoite tähän",
        displayName: "Henkilön nimi",
      },
    ],
  },
};

async function sendMessage() {
  const poller = await client.beginSend(message);
  console.log(poller);
  const response = await poller.pollUntilDone();
  console.log(response);
}

sendMessage();
