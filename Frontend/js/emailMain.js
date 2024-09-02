let items;
let Timestamp;
let filterType = null;
let selectedItem = null;
let globalIndex;
const url = "http://127.0.0.1:8000/email";
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

  console.log(items);
  showList(items);
}
let count;
//Näyttää tuotteen sitä painettaessa
function showItem(itemIndex) {
  console.log(items[itemIndex]);
  item = items[itemIndex];
  selectedItem = item;
  globalIndex = itemIndex;
  count = 0;
  text =
    "<p style='text-align:left; padding: 10px;'>" +
    "<br> <b>Laite Id:</b> " +
    item.t_id +
    "<br><br> <b>Tyyppi:</b> " +
    item.tyyppi +
    "<br><br> <b>Sähköpostit:</b> " +
    item.emails +
    "</p>";
  itemHTML =
    "<table style='width:100%;'><tr><th>Tietokanta ID: " +
    item._id +
    "</th><th>Tyyppi: " +
    item.tyyppi +
    "</th></tr></table>" +
    text;
  /*
  let mails = item.emails.map(
    (mail) =>
      '<input id="emails' +
      count +
      '" class="emails" value="' +
      mail +
      '" /><br />'
  );*/
  document.getElementById("itemContent").innerHTML = itemHTML;
  document.getElementById("tyyppi").value = item.tyyppi;

  document.getElementById("t_id").value = item.t_id;
  document.getElementById("emails").value = item.emails;
}

//Muokkaa items-arrayn HTML-muotoon ja näyttää sen
function showList(list) {
  let listHTML =
    "<table id='table1'> <tr id='tableHeader'><th style='width: 10%; min-width: 20px;'><input type='checkbox' name='check' value='t_id' onclick='onlyOne(this)'/>ID:</th><th style='width: 20%; min-width: 20px;'><input type='checkbox' name='check' value='tyyppi' onclick='onlyOne(this)'/>tyyppi:</th>" +
    "<th><input type='checkbox' name='check' value='emails' onclick='onlyOne(this)'/>Emails:</th></tr>";
  for (let i = 0; i < list.length; i++) {
    let index = '"' + i + '"';
    listHTML =
      listHTML +
      "<tr onclick='showItem(" +
      index +
      ")' id='" +
      list[i]._id +
      "'> <td style='width: 10%; min-width: 20px;'>" +
      list[i].t_id +
      " </td><td style='width: 20%; min-width: 20px;'> " +
      list[i].tyyppi +
      " </td><td style='overflow-x: hidden; white-space: nowrap;'>" +
      list[i].emails +
      " </td></tr>";
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
let inputCount = 1;

function addInput() {
  let array = [];
  for (let i = 2; i <= inputCount; i++) {
    value = document.getElementById("emails" + i).value;
    if (value && value != "") {
      array.push(value);
    }
  }
  let countToShow = inputCount;

  inputCount = inputCount + 1;
  let innerHTML = document.getElementById("emailList").outerHTML;

  let input =
    '<div id="mailInput' +
    inputCount +
    '"><label id="label' +
    inputCount +
    '" for="emails' +
    inputCount +
    '">' +
    countToShow +
    '. Sähköposti :</label><br><input style="width: calc(60%)" id="emails' +
    inputCount +
    '" class="emails" /><button onclick="deleteInput(' +
    inputCount +
    ')" id="delete' +
    inputCount +
    '"> - </button><br></div>';
  console.log(array);
  document.getElementById("emailList").innerHTML = innerHTML + input;
  if (array.length > 0) {
    let i2 = 2;
    for (let i = 0; i < array.length; i++) {
      document.getElementById("emails" + i2).value = array[i];
      i2++;
    }
  }
}

function confirmThis() {
  if (selectedItem) {
    let text = "Oletko varma?";
    if (confirm(text) == true) {
      deleteList();
    }
  }
}
/*'<button onclick="deleteList()" style="width: 50%">Poista Lista</button>'*/

function deleteInput(input) {
  document.getElementById("mailInput" + inputCount).remove();
  inputCount = inputCount - 1;
}

function addEmails() {
  let item1 = { t_id, tyyppi };

  if (selectedItem) {
    item1 = selectedItem;
  }
  item1.t_id = document.getElementById("t_id").value;
  item1.tyyppi = document.getElementById("tyyppi").value;
  let mails = [];
  let value;
  for (let i = inputCount; i > 1; i--) {
    value = document.getElementById("emails" + i).value;
    if (value && value != "") {
      mails.push(value);
    }
  }
  if (!item1.t_id || item1.t_id == "") {
    alert("Anna seurattava ID!");
    return;
  }

  item1.emails = mails;
  if (!item1.emails || item1.emails == "") {
    alert("Anna lisättävä sähköposti!");
    return;
  }
  item1 = JSON.stringify(item1);
  console.log(item1);
  const putMethod = {
    method: "POST", // Method itself
    body: item1,
    headers: {
      "Content-type": "application/json; charset=UTF-8", // Indicates the content
    },
  };

  fetch(url + "/", putMethod)
    .then((response) => console.log(response))
    .then((response) => {
      loadItems();
      alert("Sähköpostit lisätty");
      showItem(globalIndex);
    })
    .catch(error);
}

async function deleteList() {
  if (selectedItem !== null) {
    let response = await fetch(url + "/" + selectedItem._id, {
      method: "DELETE",
    })
      .then((res) => console.log(res.status))
      .then(console.log("DELETE : response"))
      .then((res) => console.log(res));
    loadItems();
  }
}

loadItems();
