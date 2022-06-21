import { createTransport } from 'nodemailer';

export const sendEmail = async (email, subject, text, html = '') => {
  try {
    const transporter = createTransport({
      host: process.env.MAIL_HOST,
      // service: process.env.MAIL_SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const tEmail = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: html.length > 0 ? html : text,
    });
    console.log('Email sent');
    return tEmail;
  } catch (err) {
    console.error(err);
  }
};
