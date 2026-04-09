import nodemailer from 'nodemailer';

// create transporter once
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'brendan61@ethereal.email',
        pass: 'W8y62Vcxu3FVTRWyJU'
    },
});

/**
 * Send email utility function
 */
export const sendEmail = async ({
    from = 'admin@gmail.com',
    to,
    subject,
    html,
}) => {
    try {
        return await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
    } catch (error) {
        throw new Error('Failed to send email, try again');
    }
};
