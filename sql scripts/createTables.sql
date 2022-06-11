-- CREATE DATABASE RecipeDB
--     DEFAULT CHARACTER SET = 'utf8mb4';


-- CREATE TABLE Users(
--     user_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'user_id',
--     username VARCHAR(255) NOT NULL COMMENT 'username',
--     firstname VARCHAR(255) COMMENT 'firstname',
--     lastname VARCHAR(255) COMMENT 'lastname',
--     country VARCHAR(255) COMMENT 'country',
--     password VARCHAR(255) COMMENT 'password',
--     email VARCHAR(255) COMMENT 'email',
--     imgurl VARCHAR(255) COMMENT 'img-url'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

CREATE TABLE Recipe(  
    recipe_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'recipe_id',
    recipename VARCHAR(255) COMMENT 'recipename',
    picture VARCHAR(255) COMMENT 'picture',
    preperationTimeMinutes int COMMENT 'preperationTimeMinutes',
    popularity int COMMENT 'popularity',
    category VARCHAR(255) COMMENT 'category',
    hasGluten BOOLEAN COMMENT 'hasGluten',
    isVegan BOOLEAN COMMENT 'hasGluten',
    isVegetarian BOOLEAN COMMENT 'hasGluten',
    recipeUrl VARCHAR(255) COMMENT 'recipeUrl',
    servings int COMMENT 'servings',
    instructions VARCHAR(255) COMMENT 'instructions',
    recipeOwner VARCHAR(255) COMMENT 'recipeOwner',
    timePreparedInFamily VARCHAR(255) COMMENT 'timePreparedInFamily',
    user_id int COMMENT 'user_id',
    isFamilyRecipe BOOLEAN COMMENT 'isFamilyRecipe'
) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE RecipeIngredients(  
--     recipe_id int NOT NULL PRIMARY KEY COMMENT 'recipe_id',
--     ingredientName VARCHAR(255) COMMENT 'ingredientName',
--     measuringTool VARCHAR(255) COMMENT 'measuringTool',
--     amount double COMMENT 'amount'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE FavoriteRecipes(   
--     user_id int NOT NULL COMMENT 'user_id',
--     recipe_id int COMMENT 'recipe_id',
--     primary key (user_id, recipe_id)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE LikedRecipes(  
--     user_id int NOT NULL COMMENT 'user_id',
--     recipe_id int COMMENT 'recipe_id',
--     primary key (user_id, recipe_id)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

CREATE TABLE WatchedRecipes(  
    user_id int NOT NULL COMMENT 'user_id',
    recipe_id int COMMENT 'recipe_id',
    watched_date DATETIME COMMENT 'watched_date',
    primary key (user_id, recipe_id)
) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE SavedRecipes(  
--     user_id int NOT NULL COMMENT 'user_id',
--     recipe_id int COMMENT 'recipe_id',
--     primary key (user_id, recipe_id)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

CREATE TABLE SearchRecipesByUsers(
    user_id int NOT NULL PRIMARY KEY COMMENT 'user_id',
    query VARCHAR(255) COMMENT 'query',
    cuisine VARCHAR(255) COMMENT 'cuisine',
    diet VARCHAR(255) COMMENT 'diet',
    intolerances VARCHAR(255) COMMENT 'intolerances',
    number int COMMENT 'number'
) DEFAULT CHARSET UTF8 COMMENT 'newTable';