const axios = require("axios");
const nodemailer = require('nodemailer');
const serviceUser = require('./serviceUser');
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');
const { FeedbackUser, FeedbackNoUser } = require('../utilities/emailContent');

const senderEmail = process.env.Email;
// const emails = process.env.FeedbackAdminEmail.split(',').map(email => email.trim());

async function SendMail(subject, body) {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "DK", email: senderEmail },
        // to: emails.map(email => ({ email })),
        subject: subject,
        htmlContent: body
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return messagesManager.Success("feedbackSubmit");
  } catch (err) {
    console.log("Brevo error:", err.response?.data || err.message);
    throw throwError(messagesManager.Error("feedbackFail"), statusCode.SERVICE_UNAVAILABLE);
  }
}

// async function sendFeedback(body) {
//   const { userId, feedback } = body;
//   const user = userId ? await serviceUser.GetUser(userId) : null;
//   const { subject, body: mailBody } = user ? FeedbackUser(feedback, user.id, user.username, user.email) : FeedbackNoUser(feedback);
//   // return await SendMail(subject, mailBody);
// }

async function sendFeedback(body) {
  const { userId, feedback } = body;
  const user = userId ? await serviceUser.GetUser(userId) : null;
  const { subject, body: mailBody } = user ? FeedbackUser(feedback, user.id, user.username, user.email) : FeedbackNoUser(feedback);
  
  // Comment out actual email sending.
  // return await SendMail(subject, mailBody);

  // Instead, output the feedback content sent by the user to the developer terminal.
  console.log('📝 [Development Feedback Log] ------------------');
  console.log('Subject:', subject);
  console.log('Body:', mailBody);
  console.log('--------------------------------------------');

  // Return success response so frontend can detect it.
  return { success: true };
}


module.exports = { sendFeedback };