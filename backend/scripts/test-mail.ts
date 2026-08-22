import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPathBackend = path.resolve(process.cwd(), '.env');
const envPathScripts = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(envPathBackend)) {
  dotenv.config({ path: envPathBackend });
} else if (fs.existsSync(envPathScripts)) {
  dotenv.config({ path: envPathScripts });
} else {
  dotenv.config();
}


const testMail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/"/g, ''),
      },
    });

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_USER,
      subject: "Test email 2",
      text: "Test email from nodemailer again",
    });

    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

testMail();
