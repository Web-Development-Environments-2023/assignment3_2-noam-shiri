var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// router.get("/", (req, res) => res.send("im here"));

router.get("/search/:query?/:cuisine?/:diet?/:Intolerances?/:number?", async (req, res, next) => { // TO DO: get parameters in query body
  try{ //if amount is not written the default is 5
    const search_recipes = await recipes_utils.getRecipesSearch(req.params.query, req.params.cuisine, req.params.diet, req.params.Intolerances, req.params.number); 
    res.send(search_recipes);
  } catch (error){
    next(error);
  }
});

/**
 * This path returns a full details of a 3 random recipes
 */
 router.get("/random", async (req, res, next) => {
  try{
    const random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(random_3_recipes);
  } catch (error){
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

