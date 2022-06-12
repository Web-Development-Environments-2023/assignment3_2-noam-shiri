var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
 router.post('/favorites', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const recipe_id = req.body.recipe_id;
      await user_utils.markAsFavorite(user_id,recipe_id);
      res.status(200).send("The Recipe successfully saved as favorite");
    }
    else{
      throw { status: 401, message: "Only logged-in users can favorite a recipe" };
    }
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      //let favorite_recipes = {};
      const recipes_id = await user_utils.getFavoriteRecipes(user_id);
      let recipes_id_array = [];
      recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
      const results = await recipe_utils.getRecipesPreview(recipes_id_array);
      res.status(200).send(results);
    }
    else{
      throw { status: 401, message: "Only logged-in users can see their favorite recipes" };
    }
  } catch(error){
    next(error); 
  }
});


/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
 router.post('/watched', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const recipe_id = req.body.recipe_id;
      var today = new Date();
      //var watched_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      //console.log(watched_date)
      //const watched_date = 
      await user_utils.markAsWatched(user_id,recipe_id);//,watched_date
      res.status(200).send("The Recipe successfully saved as watched");
    }
    else{
      throw { status: 401, message: "Only logged-in users can see their mark recipes as watched" };
    }
  } catch(error){
    next(error);
  }
})

/**
 * This path returns the 3 last watched recipes that were viewed by the logged-in user
 */
router.get('/watched', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const recipes_id = await user_utils.get3LastWatchedRecipes(user_id);
      let recipes_id_array = [];
      recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
      const results = await recipe_utils.getRecipesPreview(user_id,recipes_id_array);
      res.status(200).send(results);
    }
    else{
      throw { status: 401, message: "Only logged-in users can see their watched recipes" };
    }
  } catch(error){
    next(error); 
  }
});

router.post('/family', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const recipe_info = {
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      ingredients: req.body.ingredients,
      image: req.body.image,
      popularity: 0,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      isFamilyRecipe: 1 //,
      //hasWatched: req.body.hasWatched,
      //hasFavorated: req.body.hasFavorated
    }
      await user_utils.saveRecipe(user_id, recipe_info);
      res.status(200).send("The Recipe successfully saved");
    }else{
      throw { status: 401, message: "Only logged-in users can add family recipes" };
    }
    } catch(error){
    next(error);
  }
})

router.get('/family', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const familyRecipes = await user_utils.getUserRecipes(user_id,1);
      res.status(200).send(familyRecipes);
    }else{
      throw { status: 401, message: "Only logged-in users can see their family recipes" };
    }
  } catch(error){
    next(error); 
  }
});

router.post('/added', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const recipe_info = {
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      ingredients: req.body.ingredients,
      image: req.body.image,
      popularity: 0,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      isFamilyRecipe: 0 //,
      //hasWatched: req.body.hasWatched,
      //hasFavorated: req.body.hasFavorated
    }
      await user_utils.saveRecipe(user_id, recipe_info);
      res.status(200).send("The Recipe successfully saved");
    }else{
      throw { status: 401, message: "Only logged-in users can add recipes" };
    }
    } catch(error){
    next(error);
  }
})

router.get('/added', async (req,res,next) => {
  try{
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const addedRecipes = await user_utils.getUserRecipes(user_id,0);
      res.status(200).send(addedRecipes);
    }else{
      throw { status: 401, message: "Only logged-in users can see their recipes" };
    }
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await user_utils.getRecipeIngredients(req.params.recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
