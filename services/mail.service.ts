import Mailjet from 'node-mailjet';
import { RequestData } from 'node-mailjet/declarations/request/Request';

const mailjetClient = (() => {
    if (!process.env.MJ_API_KEY || !process.env.MJ_SECRET_KEY) {
        throw new Error("MailJet API Key or Secret Key is missing!");
    }
    return Mailjet.apiConnect(process.env.MJ_API_KEY, process.env.MJ_SECRET_KEY);
})();

function buildMessage(to: string, subject: string, text: string, html?: string): RequestData {
    return {
        Messages: [
            {
                From: {
                    Email: process.env.EMAIL || "morphiiq.3d@gmail.com",
                    Name: process.env.APP_NAME || "Morphiq 3D",
                },
                To: [{ Email: to, Name: "Recipient" }],
                Subject: subject,
                TextPart: text,
                ...(html ? { HTMLPart: html } : {})
            }
        ]
    };
}

function sendEmail(message: RequestData): void {
    mailjetClient.post('send', { version: 'v3.1' }).request(message)
        .then(() => console.log('✅ Mailjet request accepted'))
        .catch(err => console.error('❌ Mailjet send failed:', err?.message || err));
}

export function sendWelcomeEmail(to: string) {
    sendEmail(buildMessage(to, "Welcome to Morphiq 3D", "We're excited to have you at Morphiq 3D"));
}

export function sendPrintOrderConfirmationEmail(to: string) {
    sendEmail(buildMessage(
        to,
        "Morphiq 3D: Print order confirmation",
        "Order confirmed. Your order is being processed for printing, you will be notified when it's done. Thank you for choosing Morphiq 3D."
    ));
}

export function sendDesignOrderConfirmationEmail(to: string) {
    sendEmail(buildMessage(
        to,
        "Morphiq 3D: Design order confirmation",
        "Order confirmed. Your order is being processed for prototyping, you will be notified as soon as a prototype is ready. Thank you for choosing Morphiq 3D."
    ));
}
