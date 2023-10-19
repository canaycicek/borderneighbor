function displayCountry(country) {
  const request = new XMLHttpRequest();

  request.open("GET", "https://restcountries.com/v3.1/name/" + country);
  request.send();

  // async

  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    setCountry(data);

    const countries = data[0].borders.toString();

    // load neighbor
    const req = new XMLHttpRequest();
    req.open("GET", "https://restcountries.com/v3.1/alpha?codes=" + countries);
    req.send();

    req.addEventListener("load", function () {
      const data = JSON.parse(this.responseText);
      console.log(data);
      console.log(typeof data);
      setCountry(data);
    });
  });
}

function setCountry(data) {
  data.forEach((country) => {
    const html = `
                <div class="col-3">
                    <div class="card h-100">
                        <img src="${country.flags.png}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${country.name.common}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Population: ${(
                              country.population / 1000000
                            ).toFixed(1)}</li>
                            <li class="list-group-item">Capital: ${
                              country.capital
                            }</li>
                            <li class="list-group-item">Language: ${Object.values(
                              country.languages
                            )}</li>
                        </ul>
                    </div>
                </div>
            `;
    document.querySelector(".row").insertAdjacentHTML("beforeend", html);
  });
}

displayCountry("germany");
