export const PASSWORD_RESET_REQUEST_TEMPLATE = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your Password</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                h2 { color: #333; text-align: center; }
                p { font-size: 16px; color: #555; text-align: center; }
                .button { display: block; width: 200px; margin: 20px auto; padding: 12px; background: #007bff; color: #fff; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px; }
                .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
                .signature { margin-top: 30px; text-align: center; font-size: 14px; color: #333; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Password Reset Request</h2>
                <p>Hi <b>{username}</b>,</p>
                <p>We received a request to reset your password on your Chatify.</p>
                <p>Enter this code to complete the reset.</p>
                <p>{resetCode}<p>
                <p><b>⚠️ Note:</b> This link will expire in <b>1 hour</b> for security reasons.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p class="footer">If you need any assistance, feel free to contact our support team.</p>
                <p class="signature">Best Regards,<br>Your Company Support Team</p>
            </div>
        </body>
        </html>
    `;

    export const EMAIL_VERIFICATION_TEMPLATE = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #333; text-align: center; }
            p { font-size: 16px; color: #555; text-align: center; }
            .code { display: block; width: fit-content; margin: 20px auto; padding: 12px; background: #007bff; color: #fff; font-size: 18px; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
            .signature { margin-top: 30px; text-align: center; font-size: 14px; color: #333; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Email Verification</h2>
            <p>Hi <b>{username}</b>,</p>
            <p>Thank you for registering with Chatify.</p>
            <p>Please use the verification code below to complete your registration:</p>
            <p class="code">{verificationCode}</p>
            <p><b>⚠️ Note:</b> This code is valid for <b>1 hour</b>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p class="footer">For any assistance, feel free to contact our support team.</p>
            <p class="signature">Best Regards,<br>Your Company Support Team</p>
        </div>
    </body>
    </html>
    
;`

export const TECHNICAL_INTERVIEW_INVITE_TEMPLATE2 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Technical Interview Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
    h2 { color: #333; text-align: center; }
    p { font-size: 16px; color: #555; line-height: 1.6; }
    a { color: #007bff; text-decoration: none; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    .signature { margin-top: 30px; text-align: center; font-size: 14px; color: #333; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Technical Interview Invitation</h2>
    <p>Dear <b>{username}</b>,</p>
    <p>Congratulations! You've been shortlisted for the next stage of the Full Stack Developer position at <b>Journey Software Solutions</b>.</p>
    <p><b>Interview Details:</b></p>
    <p>
      📅 <b>Date:</b> Tuesday, July 1st, 2025<br>
      🕘 <b>Time:</b> 9:00 AM (Cairo Time)<br>
      📍 <b>Location:</b> <a href="https://maps.app.goo.gl/FZeum4QnHjD2WLoN8" target="_blank">Journey Software Solutions Office</a><br>
      🧑‍💻 <b>Type:</b> Technical Interview (On-site)
    </p>
    <p>Please bring a printed copy of your CV and be prepared to discuss your full-stack experience and projects.</p>
    <p>If you have any questions or need to reschedule, just reply to this email.</p>
    <p class="footer">We look forward to meeting you!</p>
    <p class="signature">Best Regards,<br>HR Team<br>Journey Software Solutions</p>
  </div>
</body>
</html>
`;

export const TECHNICAL_INTERVIEW_INVITE_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Technical Interview Invitation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
    h2 { color: #333; text-align: center; }
    p { font-size: 16px; color: #555; text-align: center; line-height: 1.6; }
    .info-box { display: block; width: fit-content; margin: 15px auto; padding: 12px 20px; background: #007bff; color: #fff; font-size: 16px; border-radius: 5px; font-weight: bold; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    .signature { margin-top: 30px; text-align: center; font-size: 14px; color: #333; font-weight: bold; }
    a { color: #fff; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Technical Interview Invitation</h2>
    <p>Hi <b>{username}</b>,</p>
    <p>Congratulations! You've been shortlisted for the next stage of the Full Stack Developer position at <b>Journey Software Solutions</b>.</p>
    <p>Please find the interview details below:</p>

    <div class="info-box">📅 Date: Monday, June 30th, 2025</div>
    <div class="info-box">🕘 Time: 8:00 AM (Cairo Time)</div>
    <div class="info-box">
      📍 Location: 
      <a href="https://maps.app.goo.gl/FZeum4QnHjD2WLoN8" target="_blank">Google Maps Link</a>
    </div>
    <div class="info-box">🧑‍💻 Type: Technical Interview (On-site)</div>

    <p>Please bring a printed copy of your CV and be ready to discuss your full-stack projects and experience.</p>
    <p><b>⚠️ Note:</b> Kindly arrive <b>at least 1 hour before</b> the scheduled time to complete check-in and preparations.</p>
    <p>If you have any questions or need to reschedule, feel free to reply to this email.</p>

    <p class="footer">We look forward to meeting you!</p>
    <p class="signature">Best Regards,<br>HR Team<br>Journey Software Solutions</p>
  </div>
</body>
</html>
`;

export const INTERVIEW_RESCHEDULE_EARLIER_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Updated Interview Schedule</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
    h2 { color: #333; text-align: center; }
    p { font-size: 16px; color: #555; text-align: center; line-height: 1.6; }
    .info-box { display: block; width: fit-content; margin: 15px auto; padding: 12px 20px; background: #007bff; color: #fff; font-size: 16px; border-radius: 5px; font-weight: bold; text-align: center; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    .signature { margin-top: 30px; text-align: center; font-size: 14px; color: #333; font-weight: bold; }
    a { color: #fff; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Updated Interview Schedule</h2>
    <p>Hi <b>{username}</b>,</p>
    <p>We hope you're doing well.</p>
    <p>We would like to inform you that your technical interview for the Full Stack Developer position at <b>Journey Software Solutions</b> has been <b>rescheduled to an earlier date</b>.</p>
    
    <div class="info-box">📅 New Date: Monday, June 30th, 2025</div>
    <div class="info-box">🕘 Time: 9:00 AM (Cairo Time)</div>
    <div class="info-box">
      📍 Location: 
      <a href="https://maps.app.goo.gl/FZeum4QnHjD2WLoN8" target="_blank">Google Maps</a>
    </div>
    <div class="info-box">🧑‍💻 Type: Technical Interview (On-site)</div>

    <p><b>⚠️ Note:</b> Kindly arrive at least <b>1 hour before</b> the scheduled time for check-in and preparation.</p>
    <p>We sincerely apologize for any inconvenience this change may cause, and we appreciate your flexibility.</p>
    <p>Please confirm your availability by replying to this email.</p>

    <p class="footer">We look forward to meeting you!</p>
    <p class="signature">Best Regards,<br>HR Team<br>Journey Software Solutions</p>
  </div>
</body>
</html>
`;

