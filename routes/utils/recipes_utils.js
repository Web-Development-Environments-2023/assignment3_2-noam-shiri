const axios = require("axios");
const { query } = require("express");
const { param } = require("../recipes");
const api_domain = "https://api.spoonacular.com/recipes";



/*
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

async function extractPreviewSearch(recipes_info){
    return recipes_info.map((recipes_info) => { //check each recipe
        let data = recipes_info;
        if (recipes_info.data){
            data = recipes_info.data;
        }
        const { id, title, image, imageType } = data;
        
        return {
            id: id,
            title: title,
            image: image,
            imageType: imageType,
        }
    })
}

/*
 * Get3  random recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
async function getRandomThreeRecipes() { 
    let random_pool = await getRandomRecipes(3);
    let filtered_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) //validate filter?
    if (filtered_random_pool.length < 3){
        return getRandomThreeRecipes(); //again
    }
    return extractPreviewRecipeDetails([filtered_random_pool[0], filtered_random_pool[1], filtered_random_pool[2]]);
}

/*
 * Get k random recipes list from spooncular response
 * @param {*} recipes_info 
 */
async function getRandomRecipes(k) { //this function returns from the spooncular api k random recipes
    const response = await axios.get(`${api_domain}/random` , {
        params: {
            number: k ,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

/*
 * Get recipes list from spooncular response that matches the query parameters and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
async function getRecipesSearch(data) { //this function returns from the spooncular api the search results for the given parameters
    if (!data.number_)
        data.number_=5; //default
    searchRecipes = searchRecipesByParams(data);
    // searchRecipesWithDetails = searchRecipes.map((searchRecipes) => {})
    return searchRecipes;
}

async function searchRecipesByParams(data){
    const response = await axios.get(`${api_domain}/complexSearch` , {
        params: {
            query: data.query,
            cuisine: data.cuisine,
            diet: data.diet,
            intolerances: data.intolerances,
            number: data.number,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return extractPreviewSearch(response.data.results);
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.getRecipesSearch = getRecipesSearch;
