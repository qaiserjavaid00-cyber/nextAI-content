import nodemailer from 'nodemailer';


// create transporter once
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'brendan61@ethereal.email',
//         pass: 'W8y62Vcxu3FVTRWyJU'
//     },
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
/**
 * Send email utility function
 */
export const sendEmail = async ({
    from = process.env.EMAIL_USER,
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
