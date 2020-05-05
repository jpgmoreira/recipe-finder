# Recipe Finder

A recipes website created for the purpose of learning Node.js

You can access it here: https://jpgmoreira-recipe-finder.herokuapp.com/

The functionalities present in the website are:

- Search for a recipe by its name or ingredients.
- Create a new user's account.
- Receive a welcome email upon creating a new account.
- Log in an existing account. 
- Read description, preparing instructions, and see ingredient images of recipes.
- Mark recipes as favorites.
- Manage your favorite recipes list.
- Manage your account (change password and delete account).



## Recipes information source

The information pertinent to the recipes shown on the website, such as recipe names, descriptions, ingredients, ingredient images, and preparing instructions, are fetched from the [Spoonacular food and recipes API](https://spoonacular.com/food-api).

Before displaying any information to the user, I decided to filter the data received from Spoonacular API, removing from it some words and terms related to allergies or special diets such as "gluten free" and "lacto ovo vegetarian". The words I remove from the content are replaced by asterisk (*) characters.



## Technologies

#### Front-end:

- HTML5
- CSS3
- JavaScript
- Bootstrap 4.4.1

#### Back-end:

- Node.js
- MongoDB
- Mongoose
- Handlebars
- JSON Web Tokens



## External APIs

- [Spoonacular API](https://spoonacular.com/food-api)
- [Sendgrid email API](https://sendgrid.com/solutions/email-api/)



## Assets credits

- Home page logo, Navbar logo: https://www.freelogodesign.org/
- Favicon: https://icon-icons.com/
- Background image: https://unsplash.com/ 



## Notice

This application is intended for learning and entertainment purposes. **I don't recommend you to prepare any food based on the information displayed on this website**, or at least you should consult the original source of the recipe, present at the bottom of the recipe's page.