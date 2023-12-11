let api_id = "";
let api_key = "";

let responseData;
let searchID;
let url;

function urlTyped(searchID) {
    return `https://api.edamam.com/api/recipes/v2?type=public&q=${searchID}&app_id=${api_id}&app_key=${api_key}`;
}

window.addEventListener("DOMContentLoaded", () => {
    searchID = "chicken";
    url = urlTyped(searchID);
    fetchFunc(url);
});

let searchFood = document.getElementById("searchFood");
let searchIcon = document.getElementById("searchIcon");

searchIcon.addEventListener("click", () => {
    searchID = searchFood.value;

    if (searchID == "") {
        fetchFunc(url);
    } else {
        heroSection.innerHTML = "";
        url = urlTyped(searchID);
        fetchFunc(url);
    }
});

async function fetchFunc(url) {
    try {
        let myData = await fetch(url);
        responseData = await myData.json();

        fetchDataResult(responseData);

    } catch (error) {
        console.log("error");
    }
}

let heroSection = document.getElementById("heroSection");

async function fetchDataResult(responseData) {
    heroSection.innerHTML = "";

    responseData.hits.forEach((element) => {
        printDataOnWindow(element.recipe);
    });
}

function printDataOnWindow(data) {
    let dishName = data.label;
    let calories = data.calories.toString().split(".")[0];
    let ingredient = data.ingredientLines.length;
    let sourceName = data.source;
    let imgUrl = data.images.REGULAR.url;

    let newDiv = document.createElement("div");
    newDiv.classList.add("card");

    heroSection.appendChild(newDiv);

    let htmlData = `
            <img id="recipeImage" src="${imgUrl}" alt="food image" class="apiImg" />
            <div id="recipeName" class="dishName">${dishName}</div>
            <div class="line"></div>
            <div class="calIng">
                <div id="cal"><span>${calories}</span>Calories</div>
                <div id="ing"><span>${ingredient}</span>Ingredients</div>
            </div>
            <div class="line"></div>
            <div id="recipeLink" class="sourceLink">${sourceName}</div>
            `;

    newDiv.innerHTML += htmlData;

    newDiv.addEventListener('click', () => {
        window.open(data.url);
    });

}

let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
    if (responseData.to < 20) {
        return;
    }

    let myUrl = url.split("&_cont=")[0];

    let newUrl = responseData._links.next.href.split("&_cont=");
    let _newCount = newUrl[1].split("&")[0];
    url = myUrl + "&_cont=" + _newCount;

    fetchFunc(url);

    (function () {
        setTimeout(() => {
            window.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }, 1000);
    })();
});
