const Filter = require('bad-words');
const customBadWords = require('./custom_bad_words');

// Configure bad-words filter:
const filter = new Filter({ placeHolder: ' ', emptyList: true });
filter.addWords(...customBadWords);

/**
 * searchPagination:
 * Compute the page buttons content to be displayed on search results pagination.
 * Returns an array of objects with the properties:
 * {
 *   text: string. button's text (page number, 'Previous' or 'Next'),
 *   current: boolean. true if it is the current page.
 * 	 blocked: boolean. true if the button cannot be clicked.
 *   dest: string. link to the page destination for the button.
 * }
 */
const searchPagination = (searchText, pageNumber, resultsPerPage, totalResults) => {
	const maxPage = Math.ceil(totalResults / resultsPerPage);
    const currPage = Math.min(pageNumber, maxPage);

	const pd = 7;  // Number of page numbers to display on the menu.
	const pdFloor = Math.floor(pd/2);

	let low = 0, high = 0;

	if ( (maxPage <= pd) || (currPage <= pdFloor) ) {
		low = 1;
		high = Math.min(pd, maxPage);
	}
	else if ( maxPage - currPage < pdFloor) {
		low = maxPage - pd + 1;
		high = maxPage;
	}
	else {
		low = currPage - pdFloor;
		high = currPage + pdFloor;
	}

	const previousPage = (currPage === 1) ? 1 : (currPage - 1);
	const nextPage = (currPage === maxPage) ? maxPage : (currPage + 1);

	let pages = [{
		text: 'Previous',
		current: false,
		blocked: (currPage === 1),
		dest: `/search?searchText=${searchText}&pageNumber=${previousPage}`
	}];
	for (let i = low; i <= high; i++) {
		pages.push( {
			text: String(i),
			current: (i === currPage),
			blocked: false,
			dest: `/search?searchText=${searchText}&pageNumber=${i}`
		});
	}
	pages.push({
		text: 'Next',
		current: false,
		blocked: (currPage === maxPage),
		dest: `/search?searchText=${searchText}&pageNumber=${nextPage}`
	});

	return pages;
}


/**
 * Returns the text filtered, removing undesired words.
 * In case text is not a string, returns an empty string.
 */
const filterBadWords = (text) => {
	if (! (typeof text === 'string'))
		return '';
	return filter.clean(text);
}

module.exports = {
	searchPagination,
	filterBadWords
};
