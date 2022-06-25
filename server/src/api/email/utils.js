import { createTransport } from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendEmail = async (email, subject, text, html = '') => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        type: 'OAUTH2',
        user: process.env.MAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
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

/*
for test emails we can use ethereal mock emailer using options
{
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
}
*/
