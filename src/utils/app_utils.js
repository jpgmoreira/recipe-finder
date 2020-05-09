const Filter = require('bad-words');
const customBadWords = require('./custom_bad_words');

// Configure bad-words filter:
const filter = new Filter({ placeHolder: '*', emptyList: true });
filter.addWords(...customBadWords);

/**
 * Compute the content of the buttons on the page navigation bar of the search results page.
 * Returns an array of objects with the properties:
 * {
 *   -- text: string. button's text (page number, '<' or '>'),
 *   -- current: boolean. true if it is the current page.
 * 	 -- blocked: boolean. true if the button cannot be clicked.
 *   -- dest: string. href to the page destination of the button.
 * 	 -- required: string. 'pag-required' if the button will be displayed 
 *        regardless of the device width. 'pag-not-required' otherwise.
 * }
 */
const searchPagination = (searchText, pageNumber, resultsPerPage, totalResults) => {
	const maxPage = Math.ceil(totalResults / resultsPerPage);
    const currPage = Math.min(pageNumber, maxPage);

	const pd = 7;  // Number of page numbers to display on the bar.
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
		text: '<',
		current: false,
		blocked: (currPage === 1),
		dest: `/search?searchText=${searchText}&pageNumber=${previousPage}`,
		required: 'required'
	}];
	for (let i = low; i <= high; i++) {
		pages.push( {
			text: String(i),
			current: (i === currPage),
			blocked: false,
			dest: `/search?searchText=${searchText}&pageNumber=${i}`,
			required: (Math.abs(currPage - i) <= 1) ? 'pag-required' : 'pag-not-required'
		});
	}
	pages.push({
		text: '>',
		current: false,
		blocked: (currPage === maxPage),
		dest: `/search?searchText=${searchText}&pageNumber=${nextPage}`,
		required: 'required'
	});

	return pages;
}


/**
 * Returns the text filtered removing undesired words.
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
