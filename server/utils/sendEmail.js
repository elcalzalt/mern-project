import nodemailer from "nodemailer";

let cachedTransporter;

const resolveTransporter = () => {
	if (cachedTransporter) {
		return cachedTransporter;
	}

	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } =
		process.env;

	if (!SMTP_HOST || !SMTP_PORT) {
		throw new Error(
			"SMTP configuration is missing. Check SMTP_HOST and SMTP_PORT."
		);
	}

	cachedTransporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: SMTP_SECURE === "true",
		auth:
			SMTP_USER && SMTP_PASS
				? {
						user: SMTP_USER,
						pass: SMTP_PASS,
				  }
				: undefined,
	});

	return cachedTransporter;
};

const resolveFrom = () => {
	const { EMAIL_FROM, SMTP_USER } = process.env;
	return EMAIL_FROM || SMTP_USER || "no-reply@example.com";
};

const sendEmail = async ({ to, subject, html, text }) => {
	if (!to) {
		throw new Error("Email recipient is required.");
	}
	if (!subject) {
		throw new Error("Email subject is required.");
	}

	const transporter = resolveTransporter();

	await transporter.sendMail({
		from: resolveFrom(),
		to,
		subject,
		text,
		html,
	});
};

export default sendEmail;
