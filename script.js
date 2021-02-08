const search = document.getElementById("search");
const submit = document.getElementById("submit");
const everyRecipe = document.getElementById("recipe");
const resultHeading = document.getElementById("result");
const searchRecipe = document.getElementById("search-recipe");

function searchedRecipe(e) {
  e.preventDefault();
  searchRecipe.innerHTML = "";


  const searchItem = search.value;
  if (searchItem.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchItem}`
    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result For ${searchItem} : </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `
          <h2>There are No Search results for ${searchItem}</h2>`;
          console.log("hi");
        } else {
          everyRecipe.innerHTML = data.meals
            .map(
              (meal) => `
                 <div class="meal">
                 <div class= "meal-img">
                 <img src="${meal.strMealThumb}" alt="${meal.strMeal}" /></div>
                 <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                 </div>
                 <div class="meal-info" data-mealID="${meal.idMeal}">
                 </div>
                 </div>
                `
            )
            .join("");
        }
      });

    search.value = "";
  } else {
    alert("please enter a search value");
  }
}


function getMealById(mealID) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  )
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMeal(meal);
    });
}

function addMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${
          meal[`strMeasure${i}`]
        }`
      );
    }else{
        break;
    }
  }

  searchRecipe.innerHTML = `
  <div class="single-meal">
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <h1>${meal.strMeal}</h1>
  <div class="main">
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>
  `
}

//Event Listener
submit.addEventListener("submit", searchedRecipe);
everyRecipe.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute(
      "data-mealid"
    );
    getMealById(mealID);
  }
});