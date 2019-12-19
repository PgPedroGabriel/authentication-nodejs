import nodemailer from 'nodemailer';
import '../../bootstrap';

export default async (to, url) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_AUTH_USER, // generated ethereal user
      pass: process.env.SMTP_AUTH_PASS // generated ethereal password
    }
  });

  await transporter.sendMail({
    from: '"no-reply" <no-reply@example.com>', // sender address
    to, // list of receivers
    subject: 'Confirmação de cadastro', // Subject line
    text: `Por favor, abra o link ${url} para confirmar o seu cadastro`, // plain text body
    html: `Por favor, para comfirmar o seu cadastro, clique no link <a href="${url}" target="_blank">${url}</a>` // html body
  });
};
