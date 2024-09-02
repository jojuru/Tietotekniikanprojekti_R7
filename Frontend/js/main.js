let items;
let Timestamp;
let filterType = null;
let selectedItem = null;
let globalIndex;
const url = "http://127.0.0.1:8000/virhe/";
//estää valitsemasta montaa vaihtoehtoa yhtä aikaa
function onlyOne(checkbox) {
  if (checkbox.checked == false) {
    filterType = null;
  } else {
    var checkboxes = document.getElementsByName("check");
    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });
    filterType = checkbox.value;
  }
}

//Valitsee hakuruudun uudelleen haun jälkeen
function checkTheBox(checkbox) {
  if (filterType !== null) {
    var checkboxes = document.getElementsByName("check");
    checkboxes.forEach((item) => {
      if (item.value == filterType) item.checked = true;
    });
  }
}

//Hakee tuotetiedot
async function loadItems() {
  const response = await fetch(url, {
    method: "GET",
  });

  items = await response.json();
  items.forEach(dateFormatter);
  console.log(items);
  showList(items);
}

//Näyttää tuotteen sitä painettaessa
function showItem(itemIndex) {
  console.log(items[itemIndex]);
  item = items[itemIndex];
  selectedItem = item;
  globalIndex = itemIndex;
  if (item.Tarkastettu === "Kyllä" && item.State === "NotOk") {
    text =
      "Tuotteessa " +
      item.PartSerialNumber +
      " on tapahtanut virhe. Tuote on tarkistettu ja se ei läpäissyt laadunvalvontaa";
  } else if (item.State === "Ok") {
    text =
      "Tuotteessa " +
      item.PartSerialNumber +
      " on tapahtanut virhe. Tuote on tarkistettu ja se läpäisi laadunvalvonnan";
  } else {
    text =
      "Tuotteessa " +
      item.PartSerialNumber +
      "on tapahtanut virhe ja sitä ei ole tarkistettu.";
  }
  text = "<p style='margin: 10px; margin-top: 20px;'>" + text + "</p>";

  text =
    text +
    "<p style='text-align:left; padding: 10px;'>" +
    "<br> <b>Tapahtuma Id:</b> " +
    item.Id +
    "<br><br> <b>Hitsaaja:</b> " +
    item.Welder +
    "<br><br> <b>ProxessingStepNumber:</b> " +
    item.ProcessingStepNumber +
    "<br><br> <b>PartArticleNumber:</b> " +
    item.PartArticleNumber +
    "<br><br><b>MachineType:</b> " +
    item.MachineType +
    "<br><br><b>Details:</b> " +
    item.Details +
    "</p>";
  itemHTML =
    "<table style='width:100%;'><tr><th>Tuote ID: " +
    item.PartSerialNumber +
    "</th><th>Laite ID: " +
    item.MachineSerialNumber +
    "</th><th>Aika: " +
    item.Timestamp +
    "</th></tr></table>" +
    text;
  document.getElementById("itemContent").innerHTML = itemHTML;
}

function dateFormatter(x) {
  let date = new Date(x.Timestamp);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedDate = dd + "." + mm + "." + yyyy;
  x.time = formattedDate;
  return x;
}

//Muokkaa items-arrayn HTML-muotoon ja näyttää sen
function showList(list) {
  let listHTML =
    "<table> <tr id='tableHeader'><th><input type='checkbox' name='check' value='PartSerialNumber' onclick='onlyOne(this)'/>Tuote ID:</th><th><input type='checkbox' name='check' value='MachineSerialNumber' onclick='onlyOne(this)'/>Laite:</th>" +
    "<th><input type='checkbox' name='check' value='time' onclick='onlyOne(this)'/>Aika:</th> <th><input type='checkbox' name='check' value='State' onclick='onlyOne(this)'/>Tuotteen tila:</th><th><input type='checkbox' name='check' value='Tarkastettu' onclick='onlyOne(this)'/>Tuote tarkastettu:</th></tr>";
  for (let i = 0; i < list.length; i++) {
    let index = '"' + i + '"';
    listHTML =
      listHTML +
      "<tr onclick='showItem(" +
      index +
      ")' id='" +
      list[i].Id +
      "'> <td>" +
      list[i].PartSerialNumber +
      " </td><td> " +
      list[i].MachineSerialNumber +
      " </td><td>" +
      list[i].time +
      " </td><td> " +
      list[i].State +
      "</td><td>" +
      list[i].Tarkastettu +
      "</td></tr>";
  }
  listHTML = listHTML + "</table>";
  document.getElementById("list").innerHTML = listHTML;
  checkTheBox();
}

//Filtteröi virheilmoitukset annettujen ehtojen perusteella
function filterList(filterValue) {
  let filteredItems;
  if (
    filterValue == null ||
    filterValue == "" ||
    filterValue == undefined ||
    filterType == null
  ) {
    filteredItems = items;
  } else {
    if (document.getElementById("exactMatch").checked) {
      filteredItems = items.filter(function (item, i) {
        return item[filterType].toLowerCase() == filterValue.toLowerCase();
      });
    } else {
      filteredItems = items.filter(function (item, i) {
        return item[filterType].includes(filterValue);
      });
    }
  }
  showList(filteredItems);
}

function checkNotification() {
  let item = selectedItem;
  item.Tarkastettu = "Kyllä";

  item = JSON.stringify(item);
  console.log(item);
  const putMethod = {
    method: "PUT", // Method itself
    body: item,
    headers: {
      "Content-type": "application/json; charset=UTF-8", // Indicates the content
    },
  };

  fetch(url + selectedItem._id, putMethod)
    .then((response) => console.log(response))
    .then((response) => {
      loadItems();
      showItem(globalIndex);
    });
}

async function deleteNotification() {
  if (selectedItem !== null) {
    let response = await fetch(url + selectedItem._id, {
      method: "DELETE",
    })
      .then((res) => console.log(res.status))
      .then(console.log("DELETE : response"))
      .then((res) => console.log(res));
    loadItems();
  }
}

function passCondition() {
  let item = selectedItem;
  item.State = "Ok";
  item.Tarkastettu = "Kyllä";
  item = JSON.stringify(item);
  console.log(item);
  const putMethod = {
    method: "PUT", // Method itself
    body: item,
    headers: {
      "Content-type": "application/json; charset=UTF-8", // Indicates the content
    },
  };

  fetch(url + selectedItem._id, putMethod)
    .then((response) => console.log(response))
    .then((response) => {
      loadItems();
      showItem(globalIndex);
    });
}

loadItems();
