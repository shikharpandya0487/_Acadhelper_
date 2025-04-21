import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

function sendEmail(receiverMail, token) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "shikharpandya0487@gmail.com",
                pass: "jqov hbxa rewk cfrw",
            },
        });

        const verificationUrl = `http://localhost:5000/api/verify?token=${token}`;

        const mailConfigs = {
            from: process.env.Email,
            to: receiverMail,
            subject: "Verify Your Email for Acadhelper",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Email Verification</h2>
                    <p style="color: #555; font-size: 16px;">Hello,</p>
                    <p style="color: #555; font-size: 16px;">
                        Thank you for signing up! Please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    </div>
                    <p style="color: #555; font-size: 14px;">
                        If you did not request this, please ignore this email.
                    </p>
                    <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
                        &copy; ${new Date().getFullYear()} Acadhelper. All rights reserved.
                    </p>
                </div>
            `,
        };

        transporter.sendMail(mailConfigs, function (error, info) {
            if (error) {
                console.error("Error sending email:", error);
                return reject({ message: "An error has occurred" });
            }
            return resolve({ message: "Email sent successfully", info });
        });
    });
}

export default sendEmail;
