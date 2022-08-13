var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

// router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a recipes details of a given search values and updates db of the user's last search
 */
router.put("/search", async (req, res, next) => {
  try{ //if amount is not written the default is 5
    const data = {
      user_id: req.session.user_id,
      query: req.body.query,
      cuisine: req.body.cuisine,
      diet: req.body.diet,
      intolerances: req.body.intolerances,
      number: req.body.number
    }
    const search_recipes = await recipes_utils.getRecipesSearch(data); 
    res.send(search_recipes);
  } catch (error){
    next(error);
  }
});

router.get("/search",  async (req, res, next) => {
  try{
    if (!req.session.user_id){
      throw { status: 401, message: "Only logged-in users can see their last searched recipe" };
    }
  res.send( await recipes_utils.getLastUserSearch(req.session.user_id))
  } catch (error){
      next(error);
    }
  });

/**
 * This path returns a full details of a 3 random recipes
 */
 router.get("/random", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const random_3_recipes = await recipes_utils.getRandomThreeRecipes(user_id);
    res.send(random_3_recipes);
  } catch (error){
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipe_id", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const isPrivateRecipe = req.isPrivateRecipe
    if (isPrivateRecipe){
      recipe = await user_utils.getFullRecipe(req.params.recipe_id)
      console.log(recipe)
      
    }
    else
      recipe = await recipes_utils.getRecipeDetails(user_id,req.params.recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
