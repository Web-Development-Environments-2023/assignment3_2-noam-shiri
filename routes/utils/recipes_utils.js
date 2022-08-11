const axios = require("axios");
const { query } = require("express");
const { param } = require("../recipes");
const DButils = require("./DButils");
const user_utils = require("./user_utils");
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

async function getRecipesInformationMultipleIds(recipe_ids) {
    multipleIds = "";
    for (let i=0; i<recipe_ids.length; i++){ // create string 
        multipleIds += recipe_ids[i];
        if (i<recipe_ids.length-1){
            multipleIds += ",";
        }
    }
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            ids: multipleIds,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(user_id,recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients, instructions, analyzedInstructions } = recipe_info.data;
    let hasWatched = false
    let hasFavorited = false
    if (user_id){
        hasWatched= await user_utils.checkIfWatchedRecipes(user_id,recipe_id)
        hasFavorited = await user_utils.checkIfFavoriteRecipes(user_id,recipe_id)}
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        aggregateLikes: aggregateLikes,
        hasWatched: hasWatched,
        hasFavorited: hasFavorited,
        servings: servings,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        analyzedInstructions: analyzedInstructions
    }
}

async function extractPreviewRecipeDetails(user_id,recipes_info){
    recipes=[]
    for (const recipe_info of recipes_info){    
        if(recipe_info){
            const { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, includeIngredients } = recipe_info;
            let hasWatched = false
            let hasFavorited = false
            if (user_id){
                hasWatched= await user_utils.checkIfWatchedRecipes(user_id,id)
                hasFavorited = await user_utils.checkIfFavoriteRecipes(user_id,id)}
            recipes.push({
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
                hasWatched: hasWatched,
                hasFavorited: hasFavorited
            })
        }
    }
    return recipes;
}

async function extractPreviewSearch(recipes_info){
    return recipes_info.map((recipes_info) => { //check each recipe
        let data = recipes_info;
        if (recipes_info.data)
            data = recipes_info.data;
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
async function getRandomThreeRecipes(user_id) { 
    let random_pool = await getRandomRecipes(3);
    let filtered_random_pool = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) //validate filter?
    if (filtered_random_pool.length < 3)
        return getRandomThreeRecipes(); //again
    return extractPreviewRecipeDetails(user_id,[filtered_random_pool[0], filtered_random_pool[1], filtered_random_pool[2]]);
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
    if (!data.number)
        data.number=5; //default number of recipes
    searchRecipes = await searchRecipesByParams(data);
    if (data.user_id){
        await DButils.execQuery(`INSERT INTO SearchRecipesByUsers VALUES
            (${data.user_id},'${data.query}','${data.cuisine}','${data.diet}','${data.intolerances}',${data.number})
            ON DUPLICATE KEY UPDATE
                query='${data.query}',cuisine='${data.cuisine}',diet='${data.diet}',intolerances='${data.intolerances}',number=${data.number}`);
    }
        ids = []; // array of all the ids of the recipes
    for (let i=0; i<searchRecipes.length; i++)
        ids.push(searchRecipes[i].id);
    return await getRecipesPreview(data.user_id,ids)
}

async function getLastUserSearch(user_id){
    const search = await DButils.execQuery(`select * from SearchRecipesByUsers where user_id='${user_id}'`);
    return search;
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

async function getRecipesPreview(user_id,recipes_id){
    RecipesDetails = await getRecipesInformationMultipleIds(recipes_id);
    return await extractPreviewRecipeDetails(user_id,RecipesDetails.data);
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.getRecipesSearch = getRecipesSearch;
exports.getRecipesPreview = getRecipesPreview;
exports.getLastUserSearch = getLastUserSearch;