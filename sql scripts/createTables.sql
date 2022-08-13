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

-- CREATE TABLE Recipe(  
--     id int NOT NULL AUTO_INCREMENT COMMENT 'id',
--     title VARCHAR(255) COMMENT 'title',
--     image VARCHAR(255) COMMENT 'image',
--     readyInMinutes int COMMENT 'readyInMinutes',
--     popularity int COMMENT 'popularity',
--     glutenFree BOOLEAN COMMENT 'glutenFree',
--     vegan BOOLEAN COMMENT 'vegan',
--     vegetarian BOOLEAN COMMENT 'vegetarian',
--     servings int COMMENT 'servings',
--     -- instructions VARCHAR(255) COMMENT 'instructions',
--     recipeOwner VARCHAR(255) COMMENT 'recipeOwner',
--     timePreparedInFamily VARCHAR(255) COMMENT 'timePreparedInFamily',
--     user_id int COMMENT 'user_id',
--     isFamilyRecipe BOOLEAN COMMENT 'isFamilyRecipe',
--     primary key (id, title)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE RecipeIngredients(  
--     recipe_id int NOT NULL COMMENT 'recipe_id',
--     ingredientName VARCHAR(255) COMMENT 'ingredientName',
--     measuringTool VARCHAR(255) COMMENT 'measuringTool',
--     amount double COMMENT 'amount',
--     primary key (recipe_id, ingredientName)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE FavoriteRecipes(   
--     user_id int NOT NULL COMMENT 'user_id',
--     recipe_id int COMMENT 'recipe_id',
--     primary key (user_id, recipe_id)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE WatchedRecipes(  
--     user_id int NOT NULL COMMENT 'user_id',
--     recipe_id int COMMENT 'recipe_id',
--     watched_date DATETIME COMMENT 'watched_date',
--     primary key (user_id, recipe_id)
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE SearchRecipesByUsers(
--     user_id int NOT NULL PRIMARY KEY COMMENT 'user_id',
--     query VARCHAR(255) COMMENT 'query',
--     cuisine VARCHAR(255) COMMENT 'cuisine',
--     diet VARCHAR(255) COMMENT 'diet',
--     intolerances VARCHAR(255) COMMENT 'intolerances',
--     number int COMMENT 'number'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

CREATE TABLE RecipeInstructions(  
    recipe_id int NOT NULL COMMENT 'recipe_id',
    step_index int NOT NULL COMMENT 'step_index',
    step_content VARCHAR(255) COMMENT 'step_content',
    primary key (recipe_id, step_index)
) DEFAULT CHARSET UTF8 COMMENT 'newTable';

