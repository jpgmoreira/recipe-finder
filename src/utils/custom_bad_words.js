/**
 * Words list to be removed from the content fetched from Spoonacular API. 
 * bad-words module does not recognizes strings with ',' , ' ', '-', and others, and it is not case-sensitive.
 * 
 * !!! Important !!!:
 * Do not insert any string that can be interpreted as another data type by JSON.parse() !
 * For example, do not add string numbers ('30', '10', '0.4', etc.) as custom bad words, 
 * nor 'null' nor any other thing that may be confused with data other than a string during
 * a JSON.parse() . This is because those values will be replaced by a placeholder character,
 * and it may lead to an error while parsing it back to an object.  
 */
const customBadWords = [
	'gluten',
	'glutenfree',
	'dairy',
	'dairyfree',

	'free',

	'lacto',
	'ovo',
	'vegetarian',

	'vegan',

	'ketogenic',
	'pescetarian',
	'pescatarian',
	'paleo',
	'primal',
	'whole',
	'whole30',
	'omnivore',
	'fruitarian',
	'gaps',
	'fodmap',
	'lowfodmap',
	'low',
	'fat',
	'carb',

	'diet',
	'caveman',
	'dukan',
	'atkins',
	'hcg',

	'allergic',
	'allergy',
	'allergies',
	'allergenic',
	'allergen',

	'diabetis',
	'diabetes',
	'diabetic',
	'diabetics',

	'lactose',
	'intolerant',
	'intolerance',
	'intolerances',

	'celiac',
	'coeliac'
];

module.exports = customBadWords;
