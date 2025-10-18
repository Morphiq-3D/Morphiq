import Mailjet from 'node-mailjet';
import { RequestData } from 'node-mailjet/declarations/request/Request';

// Declare the client variable outside the initialization block
let mailjetClient: Mailjet | null = null;

// Function to initialize the client (runs only once)
function getMailjetClient() {
    // 1. Check if the client is already initialized (caching)
    if (mailjetClient) {
        return mailjetClient;
    }

    // 2. Perform the environment variable check
    if (!process.env.MJ_API_KEY || !process.env.MJ_SECRET_KEY) {
        // Log an error and return null/throw error here. 
        // Throwing the error on *every* function invocation is not ideal,
        // so we can choose to handle it by returning null or throwing.
        // For a critical service like email, THROWING is generally safer 
        // to prevent API calls from proceeding.
        throw new Error("500: MailJet API Key or Secret Key is missing!"); 
    }
    
    // 3. Initialize and cache the client
    mailjetClient = Mailjet.apiConnect(process.env.MJ_API_KEY, process.env.MJ_SECRET_KEY);
    return mailjetClient;
}

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

async function sendEmail(message: RequestData): Promise<void> {
    const client = getMailjetClient();
    await client.post('send', { version: 'v3.1' }).request(message)
    console.log('✅ Mailjet request accepted');
}

export async function sendWelcomeEmail(to: string) {
    await sendEmail(buildMessage(to, "Welcome to Morphiq 3D", "We're excited to have you at Morphiq 3D"));
}

export async function sendPrintOrderConfirmationEmail(to: string) {
    await sendEmail(buildMessage(
        to,
        "Morphiq 3D: Print order confirmation",
        "Order confirmed. Your order is being processed for printing, you will be notified when it's done. Thank you for choosing Morphiq 3D."
    ));
}

export async function sendDesignOrderConfirmationEmail(to: string) {
    await sendEmail(buildMessage(
        to,
        "Morphiq 3D: Design order confirmation",
        "Order confirmed. Your order is being processed for prototyping, you will be notified as soon as a prototype is ready. Thank you for choosing Morphiq 3D."
    ));
}
