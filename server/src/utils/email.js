const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //create transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    })

    //Define email options
    const mailOptions = {
        from: "Daniel <dantwq90@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
      };

    //send the email
    await transporter.sendMail(mailOptions) 
}

// const sendEmail = async (options) => {
//   //create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,

//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     //activate in gmail less secure option
//   });

//   //Define email options
//   const mailOptions = {
//     from: "Daniel <dantwq90@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html
//   };

//   //send the email
//   await transporter.sendMail(mailOptions) 
// };

module.exports = sendEmail;