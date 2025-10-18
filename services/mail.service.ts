import Mailjet from 'node-mailjet';
import { RequestData } from 'node-mailjet/declarations/request/Request';

// Declare the client variable outside the initialization block
let mailjetClient: Mailjet | null = null;

interface MailjetError extends Error {
    statusCode?: number;
}

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

/**
 * Tries to send the email with retries on transient failures.
 * @param message 
 * @param MAX_RETRIES 
 * @param RETRY_DELAY_MS 
 * @throws MailjetError if all attempts fail or a non-retryable error occurs
 * @returns Promise<void>
 */
async function sendEmail(message: RequestData, MAX_RETRIES = 3, RETRY_DELAY_MS = 1000): Promise<void> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempting to send email (Attempt ${attempt}/${MAX_RETRIES})...`);

            // 1. Await the Mailjet request
            const client = getMailjetClient();
            await client.post('send', { version: 'v3.1' }).request(message);

            console.log('✅ Mailjet request accepted on success on attempt:', attempt);
            return; // Exit the loop and the function successfully

        } catch (error) {
            // const isTransientError = !err.statusCode || err.statusCode >= 500;
            const err = error as MailjetError;

            // Check if it's a final, non-retryable error (e.g., 401 Unauthorized, 400 Bad Request)
            if (err.statusCode && err.statusCode < 500 && err.statusCode !== 408) {
                console.error(`❌ Mailjet non-retryable error (Status ${err.statusCode}):`, err.message);
                throw err; // Throw immediately for fatal errors
            }

            // Handle transient errors (5xx or network errors)
            if (attempt === MAX_RETRIES) {
                console.error(`❌ Mailjet send failed after ${MAX_RETRIES} attempts. Final Error:`, err.message);
                throw err; // Throw the error on the final failed attempt, caught by the controller
            }

            // Log failure and wait before the next attempt
            console.warn(`⚠️ Mailjet temporary failure (Attempt ${attempt}). Retrying in ${RETRY_DELAY_MS}ms. Error:`, err.message);

            // Wait for the specified delay before the next iteration
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
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
