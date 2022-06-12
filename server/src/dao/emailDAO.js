import { createTransport } from 'nodemailer';

let client;
let poolRef;
export default class EmailDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(`Unable to connect to connection pool in EmailDAO: ${err}`);
    } finally {
      client.release();
    }
  }
  static async postEmail(email, subject, text) {
    try {
      const send = await sendEmail(email, subject, text);
      console.log('send', send);
    } catch (err) {
      console.error(err.message);
    }
  }
}

const sendEmail = async (email, subject, text) => {
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
      to: email, //process.env.MAIL_USER,
      subject: subject,
      text: text,
    });
    console.log('Email sent');
    return tEmail;
  } catch (err) {
    console.error(err);
  }
};
