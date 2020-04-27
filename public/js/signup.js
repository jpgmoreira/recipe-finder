// DOM Elements:
const $signupForm = document.querySelector('#signup-form');
const $inputPassword = document.querySelector('#input-password');
const $confirmPassword = document.querySelector('#confirm-password');
const $confirmInputGroup = document.querySelector('#confirm-input-group');

// Set toggle (show/hide) password buttons:
const togglePassword = document.querySelectorAll('.password-toggle');
togglePassword.forEach((element) => {
	element.addEventListener('click', ({ currentTarget }) => {
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
});

// Validation:
$signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const password = $inputPassword.value;
	const confirmPass = $confirmPassword.value;
	if (password !== confirmPass) {
		$confirmPassword.classList.add('is-invalid')
		$confirmInputGroup.classList.add('is-invalid');
		return;
	}
	else {
		$confirmPassword.classList.remove('is-invalid');
		$confirmInputGroup.classList.remove('is-invalid');
	}

	$signupForm.submit();
});
