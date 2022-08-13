const { query } = require("express");
const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert IGNORE into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function markAsNotFavorite(user_id, recipe_id){ // NEW FUNCTION TO CHECK
    console.log(`DELETE FROM FavoriteRecipes WHERE user_id=${user_id} AND recipe_id=${recipe_id}`);
    await DButils.execQuery(`DELETE FROM FavoriteRecipes WHERE user_id=${user_id} AND recipe_id=${recipe_id}`);
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
    await DButils.execQuery(`insert IGNORE into WatchedRecipes values ('${user_id}',${recipe_id}, NOW()) ON DUPLICATE KEY UPDATE watched_date=NOW()`);
}

async function get3LastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from WatchedRecipes where user_id='${user_id}' ORDER BY watched_date DESC LIMIT 3`);
    return recipes_id;
}
/*      hasWatched,
        hasFavorited,
        analyzedInstructions,
        extendedIngredients, 
*/
async function getUserRecipes(user_id,isFamilyRecipe){
    var query = `SELECT id, title, image, readyInMinutes, popularity AS aggregateLikes, glutenFree, vegan,
    vegetarian, servings`
    if(isFamilyRecipe)
        query += (`, recipeOwner, timePreparedInFamily`)
    query += (` FROM recipe WHERE user_id=${user_id} AND isFamilyRecipe=${isFamilyRecipe};`);
    return await DButils.execQuery(query);
}

async function saveRecipe(user_id, recipe_info){
    await DButils.execQuery(`INSERT INTO recipe 
    (user_id, title, image, readyInMinutes, popularity, glutenFree, vegan, vegetarian, servings, recipeOwner, timePreparedInFamily, isFamilyRecipe)
    VALUES ('${user_id}','${recipe_info.title}','${recipe_info.image}','${recipe_info.readyInMinutes}','${recipe_info.popularity}',${recipe_info.glutenFree},
    ${recipe_info.vegan},${recipe_info.vegetarian},'${recipe_info.servings}', '${recipe_info.recipeOwner}', '${recipe_info.timePreparedInFamily}',  ${recipe_info.isFamilyRecipe});`);
    const data = await DButils.execQuery(`SELECT id FROM recipe WHERE id = @@Identity;`)
    const recipe_id  = data[0].id;
    const ingredients = recipe_info.ingredients;
    const query_ingredients=[];
    for (const ingredient of ingredients){//recipe_id, ingredientName, measuringTool, amount
        query_ingredients.push((`(`+`'${recipe_id}'` +`,`+`'${ingredient.ingredientName}'`+`,`+`'${ingredient.measuringTool}'`+`,`+`'${ingredient.amount}'`+`)`));
        }
    await DButils.execQuery(`INSERT IGNORE INTO recipeingredients (recipe_id, ingredientName, measuringTool, amount) VALUES ${query_ingredients};`);
    // TO CHECK FROM HERE
    const instructions = recipe_info.instructions;
    const query_instructions=[];
    for (var i=0; i<instructions.length; i++){//recipe_id, ingredientName, measuringTool, amount
        query_instructions.push((`(`+`'${recipe_id}'` +`,`+`'${i+1}'`+`,`+`'${instructions[i]}'`+`)`));
        }
    // console.log(`INSERT IGNORE INTO recipeinstructions (recipe_id, step_index, step_content) VALUES ${query_instructions};`);
    await DButils.execQuery(`INSERT IGNORE INTO recipeinstructions (recipe_id, step_index, step_content) VALUES ${query_instructions};`); 
}   

async function getRecipeIngredients(recipe_id){
    //return await getFullRecipe(recipe_id);
    let ingredients =  await DButils.execQuery(`SELECT * FROM recipeingredients WHERE recipe_id=${recipe_id};`);
    for(var i=0; i<ingredients.length; i++){
        ingredients[i]["original"] = ingredients[i]["amount"] + " " + ingredients[i]["measuringTool"] + " " + ingredients[i]["ingredientName"];
    }
    return ingredients;   
}

async function getRecipeInstructions(recipe_id){
    //return await getFullRecipe(recipe_id);
    return await DButils.execQuery(`SELECT recipe_id, step_index, step_content AS step FROM recipeinstructions WHERE recipe_id=${recipe_id} ORDER BY step_index;`);
}

async function getFullRecipe(recipe_id){
    let recipe = await DButils.execQuery(`SELECT id, title, image, readyInMinutes, popularity AS aggregateLikes, glutenFree, vegan, vegetarian, servings , recipeOwner ,timePreparedInFamily FROM recipe WHERE id=${recipe_id};`);
    if (recipe.length>0){
        recipe[0]["extendedIngredients"] = await getRecipeIngredients(recipe_id);
        recipe[0]["instructions"] = await getRecipeInstructions(recipe_id);
        recipe[0]['analyzedInstructions'] = "";
        recipe[0]['hasFavorited'] = undefined;
        recipe[0]['hasWatched'] = undefined;       
        return recipe[0]; 
    }
    return recipe;
}

async function checkIfWatchedRecipes(user_id,recipe_id){
    const isFavorite = await DButils.execQuery(`select recipe_id from WatchedRecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    if (isFavorite.length>0)
        return true;
    return false;
}

function checkRecipeInfo(recipe_info){
    if (!recipe_info.title || recipe_info.readyInMinutes=="undefined" || !recipe_info.ingredients || !recipe_info.image || 
        recipe_info.vegan=="undefined" || recipe_info.vegetarian=="undefined" || recipe_info.glutenFree=="undefined" || recipe_info.servings=="undefined" || !recipe_info.instructions  || recipe_info.isFamilyRecipe=="undefined"){
            //if at least one of the arguments is null
        throw { status: 400, message: "Missing parameters" };
        }
    if (isNaN(recipe_info.readyInMinutes) || isNaN(recipe_info.servings)|| typeof recipe_info.vegan != "boolean" || typeof recipe_info.vegetarian != "boolean" || typeof recipe_info.glutenFree != "boolean" || typeof recipe_info.isFamilyRecipe != "boolean" ){
        throw { status: 400, message: "Wrong Input Parameter" };
    }
    if (recipe_info.isFamilyRecipe){
        if ( !recipe_info.recipeOwner || !recipe_info.timePreparedInFamily)
            throw { status: 400, message: "Missing parameters" };
    }
    if (recipe_info.ingredients.length<=0 || recipe_info.ingredients.some(el => el == null))
        throw { status: 400, message: "Recipe must include ingredients" };
    if (recipe_info.instructions.length<=0 || recipe_info.instructions.some(el => el == null))
        throw { status: 400, message: "Recipe must include instructions" };
}

exports.markAsFavorite = markAsFavorite;
exports.markAsNotFavorite = markAsNotFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkIfFavoriteRecipes = checkIfFavoriteRecipes;

exports.markAsWatched = markAsWatched;
exports.get3LastWatchedRecipes = get3LastWatchedRecipes;
exports.checkIfWatchedRecipes = checkIfWatchedRecipes;

exports.getUserRecipes = getUserRecipes;
exports.saveRecipe = saveRecipe;
exports.checkRecipeInfo = checkRecipeInfo;
exports.getFullRecipe = getFullRecipe;