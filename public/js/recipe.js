const favButton = document.querySelector('#fav-button');
const favBadge = document.querySelector('#fav-badge');

const ajaxAddFavorite = (id) => {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/favorites/insert');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 201 || xhr.status === 302) {
				favButton.classList.add('d-none');
				favBadge.classList.remove('d-none');
			}	
		}
	};
	xhr.send(JSON.stringify({ id }));
}

favButton.addEventListener('click', () => {
	ajaxAddFavorite(favButton.getAttribute('recipeId'));
});
