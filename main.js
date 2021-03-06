const search = document.getElementById('search');
const resultHeading = document.getElementById('result-heading'),
    mealsEl = document.getElementById('meals'),
    single_meal = document.getElementById('single-meal'),
    random = document.getElementById('random'),
    submit = document.getElementById('submit');

//search meal and fetch from api
function searchMeal(e) {
    e.preventDefault();

    //Clear single meal
    single_meal.innerHTML = '';

    //get the search term
    const term = search.value;

   //check for empty
   if(term.trim()) {
       fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
       .then(res => res.json())
       .then(data => {
           console.log(data);
           resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

           if(data.meals === null) {
               resultHeading.innerHTML = `<p>There are no search results. Try again! </p>`;
           } else {
               mealsEl.innerHTML = data.meals.map(meal => `
               <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
               </div>
               `).join('');
           }
        });
        //clear search value
        search.value = '';

   } else {
       alert('Please enter a search value');
   }
}
//fetch meal by id 
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealtoDom(meal);
    });
}

//add meal to DOM

function addMealtoDom(meal) {
    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src-"${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
        </div>
    `
}

//event listener
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false
        }
    });

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID)
    }
});