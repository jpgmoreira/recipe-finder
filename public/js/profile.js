const $deleteButton = document.querySelector('#delete-button');
const $deleteAlert = document.querySelector('#delete-alert');
const $deleteNo = document.querySelector('#delete-no');

$deleteButton.addEventListener('click', () => {
	$deleteAlert.classList.remove('d-none');
});

$deleteNo.addEventListener('click', (e) => {
	e.preventDefault();
	$deleteAlert.classList.add('d-none');
});
