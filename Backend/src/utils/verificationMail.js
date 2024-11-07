import { sendMail } from './mailSender.js';

const sendVerificationMail = async(modelType, userID, userMail) => {
    const buttonStyle = `
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #000;
        text-decoration: none;
        border-radius: 5px;
    `;

    const button = `<a href="${process.env.VERIFICATION_LINK}/${modelType}/verify/${userID}" style="${buttonStyle}">Verify Email</a>`;
    const manualLink = `${process.env.VERIFICATION_LINK}/${modelType}/verify/${userID}`;

    const message = `Please click the below link to verify your mail for Occasio<br><br>${button}<br><br>If the button is not working, please use the following link: <a href="${manualLink}">${manualLink}</a>`;

    try {
        const mailResponse = await sendMail(userMail, "Occasio Email Verification", message, message);
        if (mailResponse.status !== 200) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export default sendVerificationMail;