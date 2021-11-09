import nodemailer from 'nodemailer';

export const sendEmail = async (from, to, subject, text, htmlBody) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSE,
    },
  });

  const emailSent = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: htmlBody,
  });

  if (transporter && emailSent) {
    return true;
  } else {
    return false;
  }
};
