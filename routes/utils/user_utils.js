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
    await DButils.execQuery(`insert into WatchedRecipes values ('${user_id}',${recipe_id}, NOW())`);
}

async function get3LastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from WatchedRecipes where user_id='${user_id}' ORDER BY watched_date DESC LIMIT 3`);
    return recipes_id;
}

async function getFamilyRecipes(user_id){
    return await DButils.execQuery(`SELECT * FROM recipe WHERE user_id=${user_id};`);
    }

async function saveFamilyRecipe(user_id, recipe_info){
    await DButils.execQuery(`INSERT INTO recipe 
        (recipename, preperationTimeMinutes, picture, popularity, isVegan, isVegetarian, hasGluten, user_id, isFamilyRecipe)
        VALUES ('${recipe_info.title}','${recipe_info.readyInMinutes}','${recipe_info.image}','${recipe_info.popularity}',
        ${recipe_info.vegan},${recipe_info.vegetarian},${recipe_info.glutenFree},'${user_id}', true);`);
    }


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkIfFavoriteRecipes = checkIfFavoriteRecipes;
exports.get3LastWatchedRecipes = get3LastWatchedRecipes;

exports.markAsWatched = markAsWatched;
exports.saveFamilyRecipe = saveFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;