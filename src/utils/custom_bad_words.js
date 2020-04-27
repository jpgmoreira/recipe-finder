/**
 * Words list to be removed from the content fetched from Spoonacular API. 
 * bad-words module does not recognizes strings with ',' , ' ' and '-',
 * and is not case-sensitive.
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
	'30',
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

	'celiac',
	'coeliac'
];

module.exports = customBadWords;
