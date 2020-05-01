const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (username, email) => {
	const text = 
`
Welcome, ${username}!
I hope you will have fun playing with the Recipe Finder website :)
`;
	const msg = {
		to: email,
		from: 'staff@recipefinder.com',
		subject: 'Welcome to Recipe Finder!',
		text
	};
	sgMail.send(msg);
}

module.exports = {
	sendWelcomeEmail
};
