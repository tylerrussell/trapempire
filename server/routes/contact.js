const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cheerio = require('cheerio');

router.post('/', (req, res, next) => {
	const { name, email, message } = req.body;
	async function main() {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.ionos.com',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_ADDRESS,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
		let msg = `<p>The following message was sent, via the contact form on TrapNation.com, by <b>${name}<b> &lt;${email}&gt;. Please allow between 24-48 hours for a response.</p><hr/><p><i>${message}</i></p>`;

		const $ = cheerio.load(`<span>${msg}</span>`);
		let rawmsg = $.text();

		let info = await transporter.sendMail({
			from: '"TrapNation.com admin 👻" <i@tyzel.com>',
			to: `"${name}" <${email}>`,
			cc: `i@tyzel.com;;`,
			subject: `🔮✨TrapNation.com | Message Received from ${name}<${email}>;`,
			text: rawmsg,
			html: `<p>${msg}</p>`,
		});

		console.log('Message sent: %s', info.messageId);
		res.type('json');
		res.send(JSON.stringify(req.body, null, 4));
	}

	main().catch(console.error);
	console.log(req.body);
});

module.exports = router;
