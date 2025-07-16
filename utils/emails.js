import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import transporter from './nodemailerConfig.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE , EMAIL_VERIFICATION_TEMPLATE, TECHNICAL_INTERVIEW_INVITE_TEMPLATE, INTERVIEW_RESCHEDULE_EARLIER_TEMPLATE} from './emailTemplates.js';

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
      from: `Chatify <${process.env.Email_USER}>`,
      to: to,
      subject: 'Email Verification Code (Valid for 1 hour)',
      html: updatedHtml,
      category: 'Email Verification'
  };

  transporter.sendMail(mailOptions);
});

export const reSendVerificationEmail = async (to, username, verificationCode) => {
  const updatedHtml = EMAIL_VERIFICATION_TEMPLATE
    .replace('{username}', username)
    .replace('{verificationCode}', verificationCode);

  const mailOptions = {
    from: `Chatify <${process.env.Email_USER}>`,
    to,
    subject: 'Email Verification Code (Valid for 1 hour)',
    html: updatedHtml,
    category: 'Email Verification'
  };

  await transporter.sendMail(mailOptions); // important to await
};



export const sendTechnicalInterviewInviteEmail = asyncHandler(async (to, username) => {
  const html = TECHNICAL_INTERVIEW_INVITE_TEMPLATE.replace('{username}', username);

  const mailOptions = {
    from: `Journey Software Solutions <${process.env.Email_USER}>`,
    to,
    subject: 'Technical Interview Invitation – Full Stack Developer',
    html,
  };

  await transporter.sendMail(mailOptions);
});


export const sendInterviewRescheduleEmail = asyncHandler(async (to, username) => {
  const html = INTERVIEW_RESCHEDULE_EARLIER_TEMPLATE.replace('{username}', username);

  const mailOptions = {
    from: `Journey Software Solutions <${process.env.Email_USER}>`,
    to,
    subject: 'Updated Interview Schedule – Full Stack Developer Position',
    html,
  };

  await transporter.sendMail(mailOptions);
});
