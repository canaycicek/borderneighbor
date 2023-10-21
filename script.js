const txtSearch = document.getElementById("txtSearch");
const btnSearch = document.getElementById("btnSearch");
const countrys = document.getElementById("countrys");
const btnSend = document.getElementById("btnSend");

btnSearch.addEventListener("click", function () {
  let text = txtSearch.value;
  getCountry(text);
  txtSearch.value = "";
});

function getCountry(country) {
  const request = new XMLHttpRequest();
  request.open("GET", "https://restcountries.com/v3.1/name/" + country);
  request.send();

  // async

  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    renderCountry(data[0]);

    const countries = data[0].borders.toString();

    // load neighbors
    const req = new XMLHttpRequest();

    req.open("GET", "https://restcountries.com/v3.1/alpha?codes=" + countries);
    req.send();

    req.addEventListener("load", function () {
      const data = JSON.parse(this.responseText);
      renderNeighbors(data);
    });
  });
}

function renderCountry(data) {
  let html = `
    <div class="card-header">
      Arama Sonucu
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-4">
          <img src="${data.flags.png}" class="img-fluid">
        </div>
        <div class="col-8">
          <h3 class="card-title">${data.name.common}</h3>
          <hr>
          <div class="row">
            <div class="col-2">Nüfus: </div>
            <div class="col-10">${(data.population / 1000000).toFixed(1)} M
            </div>
          </div>
          <div class="row">
            <div class="col-2">Resmi Dil: </div>
            <div class="col-10">${Object.values(data.languages)}
            </div>
          </div>
          <div class="row">
            <div class="col-2">Başkent: </div>
            <div class="col-10">${data.capital}
            </div>
          </div>
          <div class="row">
            <div class="col-2">Para Birimi: </div>
            <div class="col-10">${Object.values(data.currencies)[0].name} (${
    Object.values(data.currencies)[0].symbol
  })
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbors(data) {
  console.log(data);
  let html = "";
  data.forEach((country) => {
    html += `
      <div class="col-2 mt-2">
        <div class="card">
          <img src="${country.flags.png}" class="card-img-top">
          <div class="card-body">
            <h6 class="card-title">${country.name.common}</h6>
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector("#neighbors").innerHTML = html;
}
