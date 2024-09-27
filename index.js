// Select DOM elements
const parentElement = document.querySelector(".countryCards");
const mainElement = document.querySelector("main");
const searchDiv = document.querySelector(".search");
let lastCardCount = 12;
let targetElement;
import error from "./Error.png";

// API URL
const API_URL = "https://restcountries.com/v3.1/all";

// State to manage data
const state = {
  all: [],
  firstTwelve: [],
  others: [],
};

// Utility function to clear HTML content
const clear = (el) => (el.innerHTML = "");

// Load the first twelve countries from the API
const LoadFirstTwelve = async function (url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    console.log(result);

    state.all.push(...result);
    state.firstTwelve.push(...result.slice(0, 12));
    state.others.push(...result.slice(12)); // Correct slicing to include from index 12 to end
  } catch (error) {
    throw error;
  }
};

// Render function to insert HTML into the DOM
function render(data = [], el, markup, position = "afterbegin") {
  let totalMarkup =
    Array.isArray(data) && data.length > 0
      ? data.map(markup).join("")
      : markup();

  el.insertAdjacentHTML(position, totalMarkup);
  observeLastCard();
}

// Function to observe the last card for infinite scrolling
function observeLastCard() {
  const lastCard = parentElement.querySelector(".card:last-child");
  if (lastCard) {
    observer.observe(lastCard);
  }
}

// Callback for the IntersectionObserver
function lastcardObserver(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    const nextBatch = state.others.slice(lastCardCount, lastCardCount + 12);
    render(nextBatch, parentElement, cardMarkup, "beforeend");
    lastCardCount += 12;
  }
}

// Initialize the IntersectionObserver
const observer = new IntersectionObserver(lastcardObserver, {
  threshold: 1.0,
});

// Function to show country details
function showCountry(e) {
  const card = e.target.closest(".card");
  if (!card) return null;
  const countryName = card.querySelector("h1").textContent;
  const cardata = state.all.find(
    (country) => country.name.common === countryName
  );
  return cardata ? [cardata] : null;
}

// Function to create country card markup
function cardMarkup(data) {
  return `
    <div class="card ${data.cca3.toLowerCase()}">
      <div class="flag" style="background-image: url('${
        data.flags.png
      }'); background-size: cover; background-position: center;"></div>
      <div class="text">
        <h1>${data.name.common}</h1>
        <p><b>Population: </b>${Number(data.population).toLocaleString()}</p>
        <p><b>Region: </b>${data.region}</p>
        <p><b>Capital: </b>${data.capital ? data.capital[0] : "N/A"}</p>
      </div>
    </div>
  `;
}

// Function to create country details markup
function countryDetailsMarkup(data) {
  if (!data) return "";
  return `
    <button class="backBtn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="20px" stroke-width="2px">
        <path d="M21.5,11.5H3.642l6.306-6.832c.188-.203,.175-.52-.028-.707-.203-.188-.52-.174-.707,.028L2.133,11.661c-.177,.192-.177,.487,0,.679l7.081,7.671c.098,.106,.232,.161,.367,.161,.122,0,.243-.044,.339-.133,.203-.187,.215-.503,.028-.707L3.642,12.5H21.5c.276,0,.5-.224,.5-.5s-.224-.5-.5-.5Z"/>
      </svg>
      Back
    </button>
    <div class="details">
      <div class="flagBig">
        <img src="${data.flags.png}" alt="${data.name.common}" />
      </div>
      <div class="textdetails">
        <h1>${data.name.common}</h1>
        <div class="countryInfo">
          <div class="right">
            <p><b>Native Name</b>: ${Object.values(data.name.nativeName)
              .map((value) => Object.values(value)[0].common)
              .join(", ")}</p>
            <p><b>Region</b>: ${data.region}</p>
            <p><b>Population</b>: ${Number(
              data.population
            ).toLocaleString()}</p>
            <p><b>Sub Region</b>: ${data.subregion}</p>
            <p><b>Capital</b>: ${
              data.capital ? data.capital.join(", ") : "No Capital"
            }</p>
          </div>
          <div class="left">
            <p><b>Top Level Domains</b>: ${
              data.tld ? data.tld.join(", ") : "N/A"
            }</p>
            <p><b>Languages</b>: ${
              data.languages ? Object.values(data.languages).join(", ") : "N/A"
            }</p>
          </div>
        </div>
        <div class="borderCountries">
          <p>Border Countries:</p>
          <div class="borders">${
            data.borders
              ?.map((border) => `<button class="border-btn">${border}</button>`)
              .join(" ") || "None"
          }</div>
        </div>
      </div>
    </div>
  `;
}

// Function to create error markup
function errorMarkup() {
  return `
    <div class="error">
      <img src="${error}" alt="Error" />
      <h1>Looks like you're not connected</h1>
      <button class="try-again">Try Again</button>
    </div>
  `;
}

// Function to create loading skeleton markup
function LoadSkeleton() {
  const demoCount = Array.from({ length: 12 }, (num) => 1);

  return demoCount
    .map(
      (current) => `
    <div class="card-demo">
      <div class="flag"></div>
      <div class="text">
        <h1>Loading...</h1>
        <p>Population: Loading</p>
        <p>Region: Loading</p>
        <p>Capital: Loading</p>
      </div>
    </div>
    <!-- Repeat the above block as needed for multiple skeletons -->
  `
    )
    .join("");
}

// Function to handle back button click globally using event delegation
document.addEventListener("click", (e) => {
  if (e.target.closest(".backBtn")) {
    let newParent = document.createElement("div").classList.add("countryCards");
    mainElement.append(newParent);
    searchDiv.classList.toggle("hidden");
    render(state.all, parentElement, cardMarkup);
    console.log(targetElement);
    targetElement.scrollIntoView();
  }
});

// Function to handle border country clicks (optional)
document.addEventListener("click", (e) => {
  if (e.target.closest(".border-btn")) {
    const borderCode = e.target.textContent.trim().toUpperCase();
    const borderCountry = state.all.find(
      (country) => country.cca3 === borderCode
    );
    if (borderCountry) {
      clear(parentElement);
      render([borderCountry], parentElement, countryDetailsMarkup);
    }
  }
});

// Event listener for country card clicks using event delegation
parentElement.addEventListener("click", (e) => {
  const data = showCountry(e);
  const card = e.target.closest(".card");
  if (!data) return;
  const country = data[0];

  clear(parentElement);
  targetElement = card;
  console.log(targetElement, card);
  searchDiv.classList.toggle("hidden");
  render([country], parentElement, countryDetailsMarkup);
});

// Initialize the application
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
      tryAgain.addEventListener("click", () => {
        clear(parentElement);
        render([], parentElement, LoadSkeleton);
        clear(parentElement);

        init();
      });
    }
  }
}

// Start the application
init();
