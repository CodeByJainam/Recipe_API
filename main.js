const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const gridContainer = document.getElementById('recipe-grid');
const sectionTitle = document.getElementById('section-title');
const errorDiv = document.getElementById('error');


function renderRecipes(recipes) {
    gridContainer.innerHTML = "";
    errorDiv.innerHTML = ""; 

    if (recipes.length === 0) {
        gridContainer.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
      
        const description = recipe.ingredients.slice(0, 3).join(", ") + "...";

        const card = `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${recipe.name}</h3>
                    <p class="card-desc"><strong>Time:</strong> ${recipe.time} | <strong>Rating:</strong> ${recipe.rating}⭐</p>
                    <p class="card-desc" style="font-style: italic;">Ingredients: ${description}</p>
                </div>
            </div>
        `;
        gridContainer.innerHTML += card;
    });
}


async function fetchRecipes(query = "") {
    try {
        
        const response = await fetch('http://localhost:3000/recipes');
        
        if (!response.ok) {
            throw new Error("Could not connect to the server.");
        }

        const allRecipes = await response.json();

       
        const filteredRecipes = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query.toLowerCase())
        );

        renderRecipes(filteredRecipes);
        
        
        if (query) {
            sectionTitle.style.display = 'block';
        }

    } catch (error) {
        console.error("Error:", error);
        gridContainer.innerHTML = "";
        errorDiv.innerHTML = `<p style="color: red; text-align: center;">Error: Please make sure 'npx json-server --watch db.json' is running.</p>`;
    }
}


searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    fetchRecipes(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        fetchRecipes(query);
    }
});

fetchRecipes();