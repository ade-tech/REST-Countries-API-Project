const parentElement = document.querySelector(".countryCards");

const API_URL = "https://restcountries.com/v3.1/all";
let lastCard;
let lastCardCount = 12;
const clear = (el) => (el.innerHTML = "");

const state = {
  firstTwelve: [],
  others: [],
};

function render(data = [], el, markup, position = "afterbegin") {
  let totalMarkup = data.length > 0 ? data.map(markup).join("") : markup();
  el.insertAdjacentHTML(position, totalMarkup);

  observeLastCard();
  lastCardCount += 12;
}
function cardMarkup(data) {
  return `
        <div class="card">
            <div class="flag" style="background-image: url('${
              data.flags.png
            }'); background-size: cover; background-position: center;"></div>
            <div class="text">
               <h1>${data.name.common}</h1>
               <p><b>Population:</b>${data.population}</p>
               <p><b>Region:</b>${data.region}</p>
               <p><b>Capital:</b>${data.capital ? data.capital[0] : ""}</p>
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

const LoadFirstTwelve = async function (url) {
  try {
    const firstTwelve = fetch(url);
    const data = await firstTwelve;
    const result = await data.json();
    //  console.log(result);

    state.firstTwelve.push(...result.slice(0, 12));
    state.others.push(...result.slice(13, result.length - 1));
  } catch (error) {
    throw error;
  }
};

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
    console.log(err.message);

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
