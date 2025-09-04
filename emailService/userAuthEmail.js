const { transporter } = require("../config/nodemailerConnection/nodemailer");

const sendForgetPasswordEmail = async (toEmail, resetPasswordLink) => {
  try {
    const mailOptions = {
      from: `"Pixel Bank" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Reset Your Password - Pixel Bank",
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
  
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">


          <h2 style="color: #262525ff;">Hello</h2>
          <p>You recently requested to reset your password for your Pixel Bank account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetPasswordLink}" style="
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              font-size: 16px;
              color: white;
              background-color: #4e4d4dff;
              text-decoration: none;
              border-radius: 5px;
          ">Reset Password</a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">Thanks,<br/>The Pixel Bank Team</p>
        </div>
  </div>
</div>


        
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

const sendFeedbackNotificationEmail = async (toEmail, feedback) => {
  try {
    const mailOptions = {
      from: `"Pixel Bank" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: `New Feedback Submitted - ${feedback.title || "Problem Feedback"}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">

          <h2 style="color: #262525ff;">New Feedback Submitted</h2>
          <p><strong>User ID:</strong> ${feedback.userId}</p>
          <p><strong>Problem ID:</strong> ${feedback.problemId}</p>
          <p><strong>Feedback Type:</strong> ${feedback.feedbackType}</p>
          <p><strong>Title:</strong> ${feedback.title}</p>
          <p><strong>Description:</strong> ${feedback.description}</p>
          ${feedback.generalIssue ? `<p><strong>General Issue:</strong> ${feedback.generalIssue}</p>` : ""}
          ${feedback.testCases ? `<p><strong>Test Cases:</strong> ${feedback.testCases}</p>` : ""}
          <p><strong>Category:</strong> ${feedback.category || "N/A"}</p>
          <p><strong>Difficulty:</strong> ${feedback.difficulty || "N/A"}</p>

          <p style="margin-top: 20px;">Thanks,<br/>The Pixel Bank Support Team System</p>
        </div>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Feedback notification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending feedback notification email:", error);
    return false;
  }
};


module.exports = {
  sendForgetPasswordEmail,
  sendFeedbackNotificationEmail
};
