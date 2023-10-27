const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "anielthakur1921@gmail.com",
    pass: "zebhghqlafcslubu",
  },
});


async function sendMail(to, subject, text, html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'anielthakur1921@gmail.com', // sender address
    to, 
    subject,
    text,
    html,
  });

}

module.exports = {sendMail};
