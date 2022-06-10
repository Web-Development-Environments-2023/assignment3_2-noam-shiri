const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function extractPreviewRecipeDetails(recipes_info){
    return recipes_info.map((recipes_info) => { //check each recipe
        let data = recipes_info;
        if (recipes_info.data){
            data = recipes_info.data;
        }
        const { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = data;
        
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
        }
    })
}

async function getRandomThreeRecipes() { 
    let random_pool = await getRandomRecipes(3);
    let filtered_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) //validate filter?
    if (filtered_random_pool.length < 3){
        return getRandomNumberRecipes(); //again
    }
    return extractPreviewRecipeDetails([filtered_random_pool[0], filtered_random_pool[1], filtered_random_pool[2]]);
}

async function getRandomRecipes(k) { //this function returns from the spooncular api k random recipes
    const response = await axios.get(`${api_domain}/random` , {
        params: {
            number: k ,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomThreeRecipes = getRandomThreeRecipes;