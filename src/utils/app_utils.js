/**
 * searchPagination:
 * Compute the page numbers to be displayed on search results pagination.
 * Returns an array of objects with the properties:
 * {
 *   value: the page number to display,
 *   current: boolean. true if value is the current page.
 * }
 */
const searchPagination = (pageNumber, resultsPerPage, totalResults) => {
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

	let pages = [];
	for (let i = low; i <= high; i++) {
		pages.push( {
			value: i,
			current: (i === currPage)
		});
	}

	return pages;
}

module.exports = {
	searchPagination
};
