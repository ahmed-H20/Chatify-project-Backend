import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import transporter from './nodemailerConfig.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE , EMAIL_VERIFICATION_TEMPLATE} from './emailTemplates.js';

// export const sendVerificationEmail = asyncHandler(async (isEmail, verificationToken) => {

// });

// export const sendWelcomeEmail = asyncHandler(async (email, name) => {

// });
export const sendPasswordResetEmail = asyncHandler(async (to, username, resetCode) => {
    const updatedHtml = PASSWORD_RESET_REQUEST_TEMPLATE
        .replace('{username}', username)
        .replace('{resetCode}', resetCode);

    const mailOptions = {
        from: `Chatify ${process.env.Email_USER}`,
        to: to,
        subject: 'Password Reset Code (Valid for 1 hour)',
        html: updatedHtml,
        category: 'Password Reset'
    }
    transporter.sendMail(mailOptions);
    // , (error, info) => {
    //     if (error) {
    //         console.error('Error sending email:', error);
    //     } else {
    //         console.log('Email sent successfully:', info.response);
    //     }
    // });
});

export const sendVerificationEmail = asyncHandler(async (to, username, verificationCode) => {
  const updatedHtml = EMAIL_VERIFICATION_TEMPLATE
      .replace('{username}', username)
      .replace('{verificationCode}', verificationCode);

  const mailOptions = {
      from: `Chatify <${process.env.USER_EMAIL}>`,
      to: to,
      subject: 'Email Verification Code (Valid for 1 hour)',
      html: updatedHtml,
      category: 'Email Verification'
  };

  transporter.sendMail(mailOptions);
});
