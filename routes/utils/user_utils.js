const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function checkIfFavoriteRecipes(user_id,recipe_id){
    const isFavorite = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    if (isFavorite.length>0)
        return true;
    return false;
}

async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`insert into WatchedRecipes values ('${user_id}',${recipe_id}, NOW()) ON DUPLICATE KEY UPDATE watched_date=NOW()`);
}

async function get3LastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from WatchedRecipes where user_id='${user_id}' ORDER BY watched_date DESC LIMIT 3`);
    return recipes_id;
}

async function getUserRecipes(user_id,isFamilyRecipe){
    return await DButils.execQuery(`SELECT id, title, image, readyInMinutes, popularity, glutenFree, vegan,
            vegetarian, servings, instructions, recipeOwner, timePreparedInFamily
         FROM recipe WHERE user_id=${user_id} AND isFamilyRecipe=${isFamilyRecipe};`);
}

async function saveRecipe(user_id, recipe_info){
    await DButils.execQuery(`INSERT INTO recipe 
        (user_id, title, image, readyInMinutes, popularity, glutenFree, vegan, vegetarian, servings, instructions, recipeOwner, timePreparedInFamily, isFamilyRecipe)
        VALUES ('${user_id}','${recipe_info.title}','${recipe_info.image}','${recipe_info.readyInMinutes}','${recipe_info.popularity}',${recipe_info.glutenFree},
        ${recipe_info.vegan},${recipe_info.vegetarian},'${recipe_info.servings}', '${recipe_info.instructions}', '${recipe_info.recipeOwner}', '${recipe_info.timePreparedInFamily}',  ${recipe_info.isFamilyRecipe});`);
    const data = await DButils.execQuery(`SELECT id FROM recipe WHERE id = @@Identity;`)
    const recipe_id  = data[0].id
    const ingredients = recipe_info.ingredients;
    const query=[];
    for (const ingredient of ingredients){//recipe_id, ingredientName, measuringTool, amount
        query.push((`(`+`'${recipe_id}'` +`,`+`'${ingredient.ingredientName}'`+`,`+`'${ingredient.measuringTool}'`+`,`+`'${ingredient.amount}'`+`)`));
        }
    await DButils.execQuery(`INSERT INTO recipeingredients (recipe_id, ingredientName, measuringTool, amount) VALUES ${query};`);
 }   

 async function getRecipeIngredients(recipe_id){
    return await DButils.execQuery(`SELECT * FROM recipeingredients WHERE recipe_id=${recipe_id};`);
    }

async function checkIfWatchedRecipes(user_id,recipe_id){
    const isFavorite = await DButils.execQuery(`select recipe_id from WatchedRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    if (isFavorite.length>0)
        return true;
    return false;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkIfFavoriteRecipes = checkIfFavoriteRecipes;

exports.markAsWatched = markAsWatched;
exports.get3LastWatchedRecipes = get3LastWatchedRecipes;
exports.checkIfWatchedRecipes = checkIfWatchedRecipes;

exports.getUserRecipes = getUserRecipes;
exports.saveRecipe = saveRecipe;
exports.getRecipeIngredients = getRecipeIngredients;