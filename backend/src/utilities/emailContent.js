const time = "10 minutes";
const companyName = "ChangeXel";
const companyURL = "https://dhirajkarangale.netlify.app";
const unsubscribeURL = "https://unsubscribe-service.vercel.app";

function Login(otp) {
    const body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        body {
            font-family: 'Press Start 2P', cursive;
            background: #1a1a1a; /* Dark background */
            margin: 0;
            padding: 0;
            color: #ffffff; /* White text */
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background: #1a1a1a; /* Dark gray */
            padding: 30px;
            border-radius: 15px;
            border: 5px solid #00f6ff; /* Neon blue border */
            box-shadow: 
                0 4px 6px rgba(0, 0, 0, 0.4), 
                inset 0 -6px 12px rgba(0, 246, 255, 0.2); /* 3D inset glow */
        }
        h1 {
            color: #ffd700; /* Bright yellow */
            font-size: 26px;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 4px 8px rgba(255, 215, 0, 0.7); /* Yellow glow */
        }
        p {
            color: #e0e0e0; /* Light gray for contrast */
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
        }
        .otp {
            display: block;
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a; /* Dark text for contrast */
            background: linear-gradient(145deg, #00f6ff, #ffd700); /* Neon blue to yellow */
            padding: 20px 25px;
            border-radius: 10px;
            letter-spacing: 8px;
            margin: 30px auto;
            text-align: center;
            max-width: 220px;
            box-shadow: 0 4px 15px rgba(0, 246, 255, 0.8); /* Glowing effect */
        }
        .company {
            color: #00f6ff; /* Neon blue */
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            text-shadow: 0 2px 5px rgba(0, 246, 255, 0.8); /* Subtle glow */
        }
        a.company-link {
            text-decoration: none;
        }
        a.company-link .company {
            color: #00f6ff;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            text-shadow: 0 2px 5px rgba(0, 246, 255, 0.8);
        }
        a.company-link:hover .company {
            color: #ffd700; /* Yellow on hover */
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #b0b0b0; /* Subtle footer text */
            text-align: center;
        }
        .footer a {
            color: #ffd700; /* Bright yellow */
            text-decoration: none;
        }
        .footer a:hover {
            color: #00f6ff; /* Neon blue on hover */
        }
        .email-container:hover {
            transform: translateY(-5px); /* Floating effect */
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Login to Your Adventure</h1>
        <p>Use the one-time password (OTP) to begin your adventure. The code will expire in <strong>${time}</strong>, so act fast!</p>
        <div class="otp">${otp}</div>
        <p>Keep this code secure and don't share it with anyone else.</p>
        <p>The adventure begins with <a class="company-link" href="${companyURL}"><span class="company">${companyName}</span></a>.</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} <a href="${companyURL}">${companyName}</a>. All rights reserved.</p>
            <p>If you wish to unsubscribe, click <a href="${unsubscribeURL}">here</a>.</p>
        </div>
    </div>
</body>
</html>
`;

    return { subject: `${companyName} Login OTP`, body: body };
}

function ChangeUserData(otp) {
    const body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        body {
            font-family: 'Press Start 2P', cursive;
            background: #1a1a1a; /* Dark background */
            margin: 0;
            padding: 0;
            color: #ffffff; /* White text */
        }
        .email-container {
            max-width: 600px;
            margin: 50px auto;
            background: #1a1a1a; /* Dark gray */
            padding: 30px;
            border-radius: 15px;
            border: 5px solid #00f6ff; /* Neon blue border */
            box-shadow: 
                0 4px 6px rgba(0, 0, 0, 0.4), 
                inset 0 -6px 12px rgba(0, 246, 255, 0.2); /* 3D inset glow */
        }
        h1 {
            color: #ffd700; /* Bright yellow */
            font-size: 26px;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 4px 8px rgba(255, 215, 0, 0.7); /* Yellow glow */
        }
        p {
            color: #e0e0e0; /* Light gray for contrast */
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
        }
        .otp {
            display: block;
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a; /* Dark text for contrast */
            background: linear-gradient(145deg, #00f6ff, #ffd700); /* Neon blue to yellow */
            padding: 20px 25px;
            border-radius: 10px;
            letter-spacing: 8px;
            margin: 30px auto;
            text-align: center;
            max-width: 220px;
            box-shadow: 0 4px 15px rgba(0, 246, 255, 0.8); /* Glowing effect */
        }
        .company {
            color: #00f6ff; /* Neon blue */
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            text-shadow: 0 2px 5px rgba(0, 246, 255, 0.8); /* Subtle glow */
        }
        a.company-link {
            text-decoration: none;
        }
        a.company-link .company {
            color: #00f6ff;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            text-shadow: 0 2px 5px rgba(0, 246, 255, 0.8);
        }
        a.company-link:hover .company {
            color: #ffd700; /* Yellow on hover */
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #b0b0b0; /* Subtle footer text */
            text-align: center;
        }
        .footer a {
            color: #ffd700; /* Bright yellow */
            text-decoration: none;
        }
        .footer a:hover {
            color: #00f6ff; /* Neon blue on hover */
        }
        .email-container:hover {
            transform: translateY(-5px); /* Floating effect */
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Secure Your Change</h1>
        <p>Use the one-time password (OTP) below to confirm changes to your account information. The code will expire in <strong>${time}</strong>, so act fast!</p>
        <div class="otp">${otp}</div>
        <p>Ensure this code is kept confidential and is not shared with anyone for your security.</p>
        <p>Change securely with <a class="company-link" href="${companyURL}"><span class="company">${companyName}</span></a>.</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} <a href="${companyURL}">${companyName}</a>. All rights reserved.</p>
            <p>If you wish to unsubscribe, click <a href="${unsubscribeURL}">here</a>.</p>
        </div>
    </div>
</body>
</html>
`;

    return { subject: `${companyName} OTP for User Data Update`, body: body };
}

function FeedbackUser(feedback, userId, userName, userEmail) {
    const body = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body{
    font-family:'Press Start 2P', cursive;
    background:#1a1a1a;
    margin:0;
    padding:0;
    color:#ffffff;
}

.email-container{
    max-width:600px;
    margin:50px auto;
    background:#1a1a1a;
    padding:30px;
    border-radius:15px;
    border:5px solid #00f6ff;
    box-shadow:
        0 4px 6px rgba(0,0,0,0.4),
        inset 0 -6px 12px rgba(0,246,255,0.2);
}

h1{
    color:#ffd700;
    font-size:28px;
    text-align:center;
    margin-bottom:25px;
    text-shadow:0 4px 8px rgba(255,215,0,0.7);
}

p{
    color:#e0e0e0;
    font-size:14px;
    line-height:1.8;
    text-align:center;
}

.info-box{
    background:#2a2a2a;
    padding:20px;
    border-radius:10px;
    border-left:5px solid #00f6ff;
    margin:25px 0;
}

.info-item{
    color:#ffffff;
    font-size:14px;
    margin-bottom:15px;
    line-height:1.8;
}

.info-item strong{
    color:#00f6ff;
}

.email-link,
.email-link:link,
.email-link:visited{
    color:#ffffff !important;
    text-decoration:underline !important;
    font-weight:bold !important;
    transition:color .3s ease !important;
}

.email-link:hover,
.email-link:active{
    color:#00f6ff !important;
}

.feedback-title{
    color:#ffd700;
    font-size:16px;
    text-align:center;
    margin-top:30px;
    margin-bottom:20px;
}

.feedback-box{
    background:#111;
    padding:20px;
    border-radius:10px;
    border:2px solid #ffd700;
    color:#ffffff;
    font-size:14px;
    line-height:1.8;
    word-break:break-word;
    text-align:center;
}

.footer{
    margin-top:30px;
    font-size:12px;
    color:#b0b0b0;
    text-align:center;
}

.footer a{
    color:#ffd700;
    text-decoration:none;
}

.footer a:hover{
    color:#00f6ff;
}

.email-container:hover{
    transform:translateY(-5px);
    transition:all .3s ease;
}

</style>
</head>

<body>

<div class="email-container">

<h1>📩 New User Feedback Received</h1>

<p>
A user has submitted feedback from 
<strong>${companyName}</strong>.
</p>

<div class="info-box">

<div class="info-item">
<strong>User ID:</strong> ${userId}
</div>

<div class="info-item">
<strong>Name:</strong> ${userName}
</div>

<div class="info-item">
<strong>Email:</strong>
<a class="email-link" href="mailto:${userEmail}">
    ${userEmail}
</a>
</div>

</div>

<div class="feedback-title">
Feedback Message:
</div>

<div class="feedback-box">
${feedback}
</div>

<div class="footer">
<p>
© ${new Date().getFullYear()}
<a href="${companyURL}">
${companyName}
</a>. All rights reserved.
</p>
</div>

</div>

</body>
</html>
`;

    return {
        subject: `📩 New Feedback from ${userName}`,
        body: body
    };
}

function FeedbackNoUser(feedback) {
    const body = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body{
    font-family:'Press Start 2P', cursive;
    background:#1a1a1a;
    margin:0;
    padding:0;
    color:#ffffff;
}

.email-container{
    max-width:600px;
    margin:50px auto;
    background:#1a1a1a;
    padding:30px;
    border-radius:15px;
    border:5px solid #00f6ff;
    box-shadow:
        0 4px 6px rgba(0,0,0,0.4),
        inset 0 -6px 12px rgba(0,246,255,0.2);
}

h1{
    color:#ffd700;
    font-size:28px;
    text-align:center;
    margin-bottom:25px;
    text-shadow:0 4px 8px rgba(255,215,0,0.7);
}

p{
    color:#e0e0e0;
    font-size:14px;
    line-height:1.8;
    text-align:center;
}

.info-box{
    background:#2a2a2a;
    padding:20px;
    border-radius:10px;
    border-left:5px solid #00f6ff;
    margin:25px 0;
}

.info-item{
    color:#ffffff;
    font-size:14px;
    line-height:1.8;
}

.info-item strong{
    color:#00f6ff;
}

.feedback-title{
    color:#ffd700;
    font-size:16px;
    text-align:center;
    margin-top:30px;
    margin-bottom:20px;
}

.feedback-box{
    background:#111;
    padding:20px;
    border-radius:10px;
    border:2px solid #ffd700;
    color:#ffffff;
    font-size:14px;
    line-height:1.8;
    text-align:center;
    word-break:break-word;
}

.footer{
    margin-top:30px;
    font-size:12px;
    color:#b0b0b0;
    text-align:center;
}

.footer a{
    color:#ffd700;
    text-decoration:none;
}

.footer a:hover{
    color:#00f6ff;
}

.email-container:hover{
    transform:translateY(-5px);
    transition:all .3s ease;
}

</style>
</head>

<body>

<div class="email-container">

<h1>📩 Anonymous Feedback Received</h1>

<p>
New feedback has been submitted from a guest user on 
<strong>${companyName}</strong>.
</p>

<div class="info-box">

<div class="info-item">
<strong>User Type:</strong> Guest / Anonymous
</div>

</div>

<div class="feedback-title">
Feedback Message:
</div>

<div class="feedback-box">
${feedback}
</div>

<div class="footer">
<p>
© ${new Date().getFullYear()}
<a href="${companyURL}">
${companyName}
</a>. All rights reserved.
</p>
</div>

</div>

</body>
</html>
`;

    return {
        subject: `📩 Anonymous Feedback Received`,
        body: body
    };
}

function emailContentOTP(otp, type) {
    let body = "";
    let subject = "";

    switch (type) {
        case "Login":
            const content = Login(otp)
            subject = content.subject;
            body = content.body;
            break;
        case "ChangeUserData":
            const changeUserData = ChangeUserData(otp)
            subject = changeUserData.subject;
            body = changeUserData.body;
            break;
        default:
            subject = "Type not found";
            body = "Type not found";
            break;
    }

    return { subject: subject, body: body };
}

module.exports = { emailContentOTP, FeedbackUser, FeedbackNoUser }