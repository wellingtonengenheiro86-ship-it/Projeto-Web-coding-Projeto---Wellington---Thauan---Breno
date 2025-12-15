
// ===== NAVEGAÇÃO ENTRE SEÇÕES =====
const btnHome = document.getElementById('btn-home');
const btnSobre = document.getElementById('btn-sobre');
const btnContato = document.getElementById('btn-contato');
const btnSobreFooter = document.getElementById('btn-sobre-footer');

const secHome = document.getElementById('sec-home');
const secSobre = document.getElementById('sec-sobre');
const secContato = document.getElementById('sec-contato');

function showSection(section) {
    secHome.style.display = 'none';
    secSobre.style.display = 'none';
    secContato.style.display = 'none';
    section.style.display = 'block';
}

btnHome.addEventListener('click', (e) => { e.preventDefault(); showSection(secHome); });
btnSobre.addEventListener('click', (e) => { e.preventDefault(); showSection(secSobre); });
btnContato.addEventListener('click', (e) => { e.preventDefault(); showSection(secContato); });
btnSobreFooter.addEventListener('click', (e) => { e.preventDefault(); showSection(secSobre); });

// ===== BUSCA DE RECEITAS =====
const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ingredient = e.target[0].value.trim();
    if (!ingredient) return alert("Digite um ingrediente!");

    recipeList.innerHTML = "<p>Carregando...</p>";
    recipeDetails.innerHTML = "";

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await res.json();

    if (!data.meals) {
        recipeList.innerHTML = "<p>Nenhuma receita encontrada.</p>";
        return;
    }

    showRecipes(data.meals);
});

function showRecipes(recipes) {
    recipeList.innerHTML = recipes.map(meal => `
        <div class="recipe-card" data-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        </div>
    `).join('');

    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', async () => {
            const id = card.dataset.id;
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const meal = (await res.json()).meals[0];
            showDetails(meal);
            recipeDetails.scrollIntoView({behavior: "smooth"});
        });
    });
}

function showDetails(meal) {
    recipeDetails.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:250px; display:block; margin:auto;">
        <h3>Ingredientes:</h3>
        <ul>
            ${getIngredients(meal).map(i => `<li>${i}</li>`).join('')}
        </ul>
        <h3>Modo de Preparo:</h3>
        <p>${meal.strInstructions}</p>
        ${meal.strYoutube ? `<h3>Vídeo:</h3><a href="${meal.strYoutube}" target="_blank">Ver no YouTube</a>` : ''}
    `;
}

function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) ingredients.push(`${ing} - ${measure}`);
    }
    return ingredients;
}

