const txtSearch = document.getElementById("txtSearch");
const btnSearch = document.getElementById("btnSearch");
const countrys = document.getElementById("countrys");
const btnLocation = document.getElementById("btnLocation");
const iconLoading = document.getElementById("loading")
const btnSend = document.getElementById("btnSend")
const neighborsCt = document.getElementsByClassName("neighborCountry")

document.getElementById("details").classList.add("displayed")

btnSearch.addEventListener("click", function () {
  let text = txtSearch.value;
  iconLoading.style.display = "block"
  getCountry(text);
  txtSearch.value = "";
});


btnLocation.addEventListener("click", () =>{
  if(navigator.geolocation){
    iconLoading.style.display = "block"
    navigator.geolocation.getCurrentPosition(onSsuccess, onError)
  }
})

const request = new XMLHttpRequest();

btnSend.addEventListener("click", function () {
  request.open("GET", `https://api.telegram.org/bot6117803484:AAFbg7hJJJRS5st3zMferEoIhL-c4C_pwyI/sendMessage?text=${txtSearch.value}&chat_id=1113062866`)
  request.send()
  txtSearch.value = ""
})

function onError(err) {
  console.log(err);
  iconLoading.style.display = "none"
}

async function onSsuccess(position) {
  let lat = position.coords.latitude
  let lng = position.coords.longitude
  
  // api, opencagedata
  const apiKey = "08964559f1474d589ce210a49b6f72c4";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  
  const response = await fetch(url);
  const data = await response.json();

  const country = data.results[0].components.country
  
  txtSearch.value = country
  btnSearch.click()
}

 async function getCountry(country) {
  try {
    document.getElementById("details").classList.remove("displayed")
    const response = await fetch("https://restcountries.com/v3.1/name/" + country)
    if(!response.ok){
      throw new Error("Ülke bulunamadı!")
    }
    const data = await response.json()
    renderCountry(data[0])

    const countries = data[0].borders;
    if(!countries){
      throw new Error("Komşu ülke bulunamadı!")
    }

    const response2 = await fetch("https://restcountries.com/v3.1/alpha?codes=" + countries)
    const neighbors = await response2.json()
    
    renderNeighbors(neighbors)
  } catch(err) {
    renderError(err)
  }

  // fetch("https://restcountries.com/v3.1/name/" + country)
  //   .then((response) => {
  //     if(response.ok){
  //       document.getElementById("details").classList.remove("displayed")

  //       return response.json()
  //     }else{
  //       throw new Error("Ülke bulunamadı!")     // throw: bir hata fırlatmak(type error yerine kendi hata yazını yazman için)
  //     }
  //   })
  //   .then((data) =>{
  //     renderCountry(data[0])
  //     const countries = data[0].borders

  //     if(!countries){
  //       throw new Error("Komşu ülke bulunamadı!")
  //     }

  //     return fetch("https://restcountries.com/v3.1/alpha?codes=" + countries.toString())
  //   })
  //   .then(response => response.json())
  //   .then((data) => renderNeighbors(data))
  //   .catch(err => renderError(err));

  // const request = new XMLHttpRequest();
  // request.open("GET", "https://restcountries.com/v3.1/name/" + country);
  // request.send();

  // // async

  // request.addEventListener("load", function () {
  //   const data = JSON.parse(this.responseText);
  //   renderCountry(data[0]);

  //   const countries = data[0].borders.toString();

  //   // load neighbors
  //   const req = new XMLHttpRequest();

  //   req.open("GET", "https://restcountries.com/v3.1/alpha?codes=" + countries);
  //   req.send();

  //   req.addEventListener("load", function () {
  //     const data = JSON.parse(this.responseText);
  //     renderNeighbors(data);
  //   });
  // });
}

function renderCountry(data) {
  iconLoading.style.display = "none"
  document.querySelector("#country-details").innerHTML = ""
  document.querySelector("#neighbors").innerHTML = ""
  let html = `
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
  `;
  document.querySelector("#details").computedStyleMap.opacity = 1;
  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbors(data) {
  let html = "";
  data.forEach((country) => {
    html += `
      <div class="col-2 mt-2">
        <div class="card otherCountry neighborCountry" data-title="${country.name.common}">
          <img src="${country.flags.png}" class="card-img-top">
          <div class="card-body blackBg">
            <h6 class="card-title">${country.name.common}</h6>
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector("#neighbors").innerHTML = html;
  
    for (let country of neighborsCt) {
      country.addEventListener("click", () =>{
        let neiCtName = country.getAttribute("data-title")
        txtSearch.value = neiCtName
        btnSearch.click()
      })
    }
}


function renderError(err) {
  iconLoading.style.display = "none"
  const html = `
    <div class="alert alert-danger">
      ${err.message}
    </div>
  `
  setTimeout(() => {
    document.getElementById("errors").innerHTML = ""
  }, 2000);
  document.getElementById("errors").innerHTML = html
}


