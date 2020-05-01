const removeButtons = document.querySelectorAll('.remove-button');

const ajaxRemoveFavorite = (id) => {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/favorites/remove');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 202) {
				const li = document.querySelector(`#li-${id}`);
				li.parentNode.removeChild(li);
			}
			else if (xhr.status === 205) {
				// If no more favorites: reload the page.
				window.location.replace('/favorites');
			}		
		}
	};
	xhr.send(JSON.stringify({ id }));
}

removeButtons.forEach((button) => {
	button.addEventListener('click', () => {
		ajaxRemoveFavorite(button.id);
	});
});
