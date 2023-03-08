const nodemailer = require("nodemailer");
const config = require("../config/auth.ts");

const user = config.user;
const pass = config.pass;
console.log(user,pass,'kkj');

const transport = nodemailer.createTransport({
  address: "smtp.gmail.com",
  port: 587,
  domain: "gmail.com",
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});
const sendConfirmationEmail = (
  name: any,
  email: any,
  otp: any
) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <p>otp : ${otp}</p>
          <a href=http://localhost:8000/confirm/${otp}> Click here</a>
          </div>`,
    })  
    .catch((err: any) => console.log('rrr',err));
};

export default sendConfirmationEmail;
