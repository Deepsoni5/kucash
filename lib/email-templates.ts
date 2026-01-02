/**
 * Email templates for KuCash
 */

export function getPasswordResetEmailTemplate(resetLink: string, userName?: string) {
  const name = userName || "User";
  
  return {
    subject: "Reset Your KuCash Password",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0066FF;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .content {
            color: #555;
            margin-bottom: 30px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
        }
        .link-text {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            word-break: break-all;
            font-size: 12px;
            color: #666;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }
        .info-box {
            background-color: #e7f3ff;
            border-left: 4px solid #0066FF;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">KuCash</div>
        </div>
        
        <h1 class="title">Reset Your Password</h1>
        
        <div class="content">
            <p>Hello ${name},</p>
            
            <p>We received a request to reset your password for your KuCash account. If you made this request, click the button below to create a new password.</p>
            
            <div class="button-container">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <div class="link-text">
                <strong>Or copy and paste this link in your browser:</strong><br>
                ${resetLink}
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact our support team.
            </div>
            
            <div class="info-box">
                <strong>ℹ️ Need help?</strong><br>
                If you're having trouble resetting your password, contact us at <a href="mailto:wecare@kucash.in" style="color: #0066FF;">wecare@kucash.in</a> or call us at <a href="tel:+919008367818" style="color: #0066FF;">+91 9008367818</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by KuCash (Madhyavarti Solutions Private Limited)</p>
            <p>© ${new Date().getFullYear()} KuCash. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="https://kucash.in" style="color: #0066FF; text-decoration: none;">Visit our website</a> | 
                <a href="https://kucash.in/privacy-policy" style="color: #0066FF; text-decoration: none;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Reset Your KuCash Password

Hello ${name},

We received a request to reset your password for your KuCash account. If you made this request, use the link below to create a new password:

${resetLink}

⚠️ Security Notice: This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact our support team.

Need help? Contact us at wecare@kucash.in or call +91 9008367818

---
This email was sent by KuCash (Madhyavarti Solutions Private Limited)
© ${new Date().getFullYear()} KuCash. All rights reserved.
    `,
  };
}


