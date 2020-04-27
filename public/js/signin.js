// DOM Elements:
const $signinForm = document.querySelector('#signup-form');
const $passwordToggle = document.querySelector('#password-toggle');

// Set toggle (show/hide) password button:
$passwordToggle.addEventListener('click', ({ currentTarget }) => {
	const input = document.querySelector('#' + currentTarget.getAttribute('data-toggle'));
	const icon = document.querySelector('#' + currentTarget.getAttribute('icon-toggle'));
	if (input.type === 'password') {
		input.type = 'text';
		icon.classList.remove('fa-eye');
		icon.classList.add('fa-eye-slash');
	}
	else {
		input.type = 'password';
		icon.classList.remove('fa-eye-slash');
		icon.classList.add('fa-eye');
	}
});
