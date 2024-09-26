const parentElement = document.querySelector(".countryCards");
const mainElement = document.querySelector("main");
let mainContentStore = "";

const API_URL = "https://restcountries.com/v3.1/all";
let lastCard;
let lastCardCount = 12;
const clear = (el) => (el.innerHTML = "");

const state = {
  all: [],
  firstTwelve: [],
  others: [],
};
const LoadFirstTwelve = async function (url) {
  try {
    const firstTwelve = fetch(url);
    const data = await firstTwelve;
    const result = await data.json();

    console.log(result);

    state.all.push(...result);
    state.firstTwelve.push(...result.slice(0, 12));
    state.others.push(...result.slice(13, result.length - 1));
  } catch (error) {
    throw error;
  }
};

function render(data = [], el, markup, position = "afterbegin") {
  let totalMarkup = data.length > 0 ? data.map(markup).join("") : markup();
  el.insertAdjacentHTML(position, totalMarkup);

  observeLastCard();
  lastCardCount += 12;
  parentElement.addEventListener("click", (e) => {
    const data = showCountry(e);
    mainContentStore = mainElement.innerHTML;
    const countryCode = data[0].cca3;
    console.log(data);

    history.pushState(
      { code: countryCode },
      `${data[0].name.common}`,
      `/${data[0].cca3.toLowerCase()}`
    );

    clear(mainElement);
    render(data, mainElement, countryDetailsMarkup);
  });

  const backBtn = document.querySelector(".backBtn");
  if (!backBtn) return;
  backBtn.addEventListener("click", function () {
    clear(mainElement);
    render(state.firstTwelve, parentElement, cardMarkup);
  });
}
const observer = new IntersectionObserver(lastcardObserver, {
  threshold: 1.0,
});

async function init() {
  try {
    clear(parentElement);
    render([], parentElement, LoadSkeleton);

    await LoadFirstTwelve(API_URL);
    clear(parentElement);
    render(state.firstTwelve, parentElement, cardMarkup);
  } catch (err) {
    clear(parentElement);
    render([], parentElement, errorMarkup);

    const tryAgain = document.querySelector(".try-again");

    if (tryAgain) {
      tryAgain.addEventListener("click", init);
    }
  }
}

init();

function observeLastCard() {
  lastCard = parentElement.querySelector(".card:last-child");
  if (lastCard) {
    observer.observe(lastCard);
  }
}

function lastcardObserver(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    observer.unobserve(lastCard);

    const nextBatch = state.others.slice(lastCardCount, lastCardCount + 12);
    render(nextBatch, parentElement, cardMarkup, "beforeend");
  }
}

function showCountry(e) {
  const card = e.target.closest(".card");
  if (!card) return;
  const countryName = card.querySelector("h1").textContent;
  const cardata = state.all.filter(
    (country) => country.name.common === countryName
  );
  return cardata;
}

function cardMarkup(data) {
  return `
        <div class="card">
            <div class="flag" style="background-image: url('${
              data.flags.png
            }'); background-size: cover; background-position: center;"></div>
            <div class="text">
               <h1>${data.name.common}</h1>
               <p><b>Population: </b>${Number(
                 data.population
               ).toLocaleString()}</p>
               <p><b>Region: </b>${data.region}</p>
               <p><b>Capital: </b>${data.capital ? data.capital[0] : ""}</p>
            </div>
         </div> `;
}

function errorMarkup() {
  return `
         <div class="error">
          <img src="Error.png" alt="" />
          <h1>Looks like you're not connected</h1>
          <button class="try-again">Try Again</button>
        </div>`;
}

function LoadSkeleton() {
  return `
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>

         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p>202022</p>
               <p> 202022</p>
               <p> 202022</p>
            </div>
         </div>
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>
         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p> 202022</p>
               <p> 202022</p>
               <p>Capital</b>: 202022</p>
            </div>
         </div>

         <div class="card-demo">
            <div class="flag"></div>
            <div class="text">
               <h1>Nigeria</h1>
               <p>202022</p>
               <p> 202022</p>
               <p> 202022</p>
            </div>
         </div>

   `;
}

function countryDetailsMarkup(data) {
  if (!data) return;
  return `
  <button class="backBtn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 30"
          x="0px"
          y="0px"
          width="20px"
          stroke-width="2px"
        >
          <path
            d="M21.5,11.5H3.642l6.306-6.832c.188-.203,.175-.52-.028-.707-.203-.188-.52-.174-.707,.028L2.133,11.661c-.177,.192-.177,.487,0,.679l7.081,7.671c.098,.106,.232,.161,.367,.161,.122,0,.243-.044,.339-.133,.203-.187,.215-.503,.028-.707L3.642,12.5H21.5c.276,0,.5-.224,.5-.5s-.224-.5-.5-.5Z"
          />
        </svg>
        Back
      </button>
      <div class="details">
        <div class="flagBig">
          <img src="${data.flags.png}" alt="" />
        </div>
        <div class="textdetails">
          <h1>${data.name.common}</h1>
          <div class="countryInfo">
            <div class="right">
              <p><b>Native Name</b>: ${Object.values(data.name.nativeName)
                .map((value) => {
                  const h = Object.values(value);
                  return h[0];
                })
                .join(", ")}
                </p>
              <p><b>Region</b>: ${data.region}</p>
              <p><b>Population</b>: ${data.population}</p>
              <p><b>Sub Region</b>: ${data.subregion}</p>
              <p><b>Capital</b>: ${
                data.capital
                  ? data.capital.length > 0
                    ? data.capital.join(", ")
                    : data.capital[0]
                  : "No Capital"
              }</p>
            </div>
            <div class="left">
              <p><b>Top Level Domains</b>: ${data.tld}</p>
              <p><b>Languages</b>: ${Object.values(data.languages).join(
                ", "
              )}</p>

            </div>
          </div>
          <div class="borderCountries">
            <p>Border Countries:</p>
            <div class="borders">${data.borders
              ?.map((border) => {
                return `
              <button>${border}</button>`;
              })
              .join(" ")}

            </div>
          </div>
        </div>
      </div>
   `;
}
