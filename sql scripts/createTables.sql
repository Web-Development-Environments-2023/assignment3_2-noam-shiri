-- CREATE DATABASE RecipeDB
--     DEFAULT CHARACTER SET = 'utf8mb4';


-- CREATE TABLE Users(
--     username VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'Primary Key',
--     firstname VARCHAR(255) COMMENT 'firstname',
--     lastname VARCHAR(255) COMMENT 'lastname',
--     country VARCHAR(255) COMMENT 'country',
--     passwd VARCHAR(255) COMMENT 'password',
--     email VARCHAR(255) COMMENT 'email',
--     imgurl VARCHAR(255) COMMENT 'img-url',
--     LastSearch VARCHAR(255) COMMENT 'LastSearch',
--     FirstLastViewedRecipeId int COMMENT 'FirstLastViewedRecipeId',
--     SecondLastViewedRecipeId int COMMENT 'SecondLastViewedRecipeId',
--     ThirdLastViewedRecipeId int COMMENT 'ThirdLastViewedRecipeId'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE Recipe(  
--     id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
--     recipename VARCHAR(255) COMMENT 'name',
--     picture VARCHAR(255) COMMENT 'picture',
--     preperationTimeMinutes int COMMENT 'preperationTimeMinutes',
--     popularity int COMMENT 'popularity',
--     category VARCHAR(255) COMMENT 'category',
--     hasGluten BIT COMMENT 'hasGluten',
--     recipeUrl VARCHAR(255) COMMENT 'recipeUrl',
--     servings int COMMENT 'servings',
--     instructions VARCHAR(255) COMMENT 'instructions',
--     recipeOwner VARCHAR(255) COMMENT 'recipeOwner',
--     timePreparedInFamily VARCHAR(255) COMMENT 'timePreparedInFamily'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';


-- CREATE TABLE usersFamilyRecipe(  
--     username VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'username',
--     recipeId int COMMENT 'recipeId'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE recipeUserAdded(  
--     username VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'username',
--     recipeId int COMMENT 'recipeId'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE UserAndrecipe(  
--     username VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'username',
--     recipeId int COMMENT 'recipeId',
--     HasWatched BIT COMMENT 'HasWatched',
--     HasSaved BIT COMMENT 'HasSaved',
--     HasLiked BIT COMMENT 'HasLiked'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';

-- CREATE TABLE RecipeIngredients(  
--     recipeId int NOT NULL PRIMARY KEY COMMENT 'recipeId',
--     ingredientName VARCHAR(255) COMMENT 'ingredientName',
--     measuringTool VARCHAR(255) COMMENT 'measuringTool',
--     amount double COMMENT 'amount'
-- ) DEFAULT CHARSET UTF8 COMMENT 'newTable';