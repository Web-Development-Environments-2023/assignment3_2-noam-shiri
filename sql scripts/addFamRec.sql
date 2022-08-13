-- INSERT INTO recipe 
--     (user_id, title, image, readyInMinutes, popularity, glutenFree, vegan, vegetarian, servings, recipeOwner, timePreparedInFamily, isFamilyRecipe)
--     VALUES (4,"Lotus Cheescake","https://www.foodisgood.co.il/wp-content/uploads/2014/12/amazing-lotus-cake-862x736.jpg", 
--     60 , 5,0,0,1,12, "Mom" , "Shavuot" , 1)

-- INSERT INTO recipeingredients (recipe_id,ingredientName,measuringTool,amount)
-- VALUES (4,"lotus spread","units",0.5)


INSERT INTO recipeinstructions (recipe_id,step_index,step_content)
VALUES (4,5,"After 4 hours that the cake has stabilized, melt the lotus spread in the microwave, transfer to a piping bag and decorate or simply spread the lotus over the cake. Decorate with 2 whole lotus cookies in the center of the cake.")