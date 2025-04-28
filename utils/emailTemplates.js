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