const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    //maybe u need to use change port to 2525 bcoz for me 25 was not working wasted hours n found only this was the prob
    //though there r 4 ports but when used 2525 then only it worked.
    port: 2525,
    //secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
  //debug: true, // show debug output
  //logger: true // log information in console
  });

 // 2) Define the email options
  const mailOptions = {
    from: 'Helix Lanester <hello@helix.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;