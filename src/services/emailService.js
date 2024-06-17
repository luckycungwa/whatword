// services/emailService.js
import { Resend } from 'resend';
import '../App.css';

const resend = new Resend('re_123456789');

export const sendVerificationEmail = async (email, verificationLink) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
/* email for m stuff  */
.card {
  width: 300px;
  height: 300px;
  background-color: #111;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-email {
  appearance: none;
  backface-visibility: hidden;
  background-color: #0e0e0e;
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
}

.button-email:hover {
  background-color: #1366d6;
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
}

.button-email:hover:after {
  opacity: .5;
}

.button-email:active {
  box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
  transform: translateY(2px);
  transition-duration: .35s;
}

.button-email:active:after {
  opacity: 1;
}

@media (min-width: 768px) {
  .button-65 {
    padding: 14px 22px;
    width: 176px;
  }
}

/* link button stuff */
.linkBtn {
  font-size: 18px;
  color: #e1e1e1;
  font-family: inherit;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
  text-transform: uppercase;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: color;
}

.linkBtn:focus,
.linkBtn:hover {
  color: #fff;
}

.linkBtn:focus:after,
.linkBtn:hover:after {
  width: 100%;
  left: 0%;
}

.linkBtn:after {
  content: "";
  pointer-events: none;
  bottom: -2px;
  left: 50%;
  position: absolute;
  width: 0%;
  height: 2px;
  background-color: #fff;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: width, left;
}

    </style>
      <title>Confirm Your Email</title>
    </head>
    <body>
    <div class="card">
      <h1>Confirm Your Subscription</h1>

      <p>Thank you for subscribing to the Word of the Day!</p>

      <p>Please confirm your email by clicking the button to start receiving our notifications.</p>
      <button type="button" class="button-email" onclick="window.location.href='${verificationLink}'">Confirm Email</button>

      or click link: <a class="linkBtn" href="${verificationLink}">Confirm Email</a>

      <p>If you did not sign up for this, please ignore this email.</p>
      <div>
    </body>
    </html>
  `;

  try {
    await resend.send({
      from: 'no-reply@whatword.vercel.app',
      to: email,
      subject: 'Confirm Your Email Subscription',
      html: emailTemplate,      //my ugggly template
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
