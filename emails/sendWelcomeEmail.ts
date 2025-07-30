import nodemailer from 'nodemailer';
import { render } from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  walletAddress: string;
  referralCode?: string;
  referredBy?: string;
  signupDate: string;
  platform: 'web' | 'mobile' | 'api';
  userType: 'farmer' | 'investor' | 'enterprise' | 'developer';
  preferences?: {
    language: string;
    timezone: string;
    notifications: boolean;
  };
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

class WelcomeEmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;
  private templatesPath: string;

  constructor(config: EmailConfig) {
    this.config = config;
    this.templatesPath = path.join(__dirname, 'templates');
    
    this.transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      const template = this.loadTemplate('welcome');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🌾 Welcome to AGROTM, ${data.userName}! Your Agricultural Revolution Starts Here`,
        html: htmlContent,
        text: textContent,
        attachments: [
          {
            filename: 'agrotm-getting-started.pdf',
            path: path.join(__dirname, 'assets', 'getting-started.pdf')
          },
          {
            filename: 'agrotm-whitepaper.pdf',
            path: path.join(__dirname, 'assets', 'whitepaper.pdf')
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendKYCApproved(data: {
    userEmail: string;
    userName: string;
    kycId: string;
    approvedAt: string;
    level: 'basic' | 'verified' | 'enterprise';
  }): Promise<void> {
    try {
      const template = this.loadTemplate('kyc-approved');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateKYCApprovedTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `✅ KYC Approved! Welcome to AGROTM, ${data.userName}`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`KYC approved email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending KYC approved email:', error);
      throw error;
    }
  }

  async sendKYCRejected(data: {
    userEmail: string;
    userName: string;
    kycId: string;
    rejectedAt: string;
    reason: string;
    nextSteps: string[];
  }): Promise<void> {
    try {
      const template = this.loadTemplate('kyc-rejected');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateKYCRejectedTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `❌ KYC Review Required - Action Needed`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`KYC rejected email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending KYC rejected email:', error);
      throw error;
    }
  }

  async sendAccountVerified(data: {
    userEmail: string;
    userName: string;
    verificationType: 'email' | 'phone' | 'wallet' | '2fa';
    verifiedAt: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('account-verified');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateAccountVerifiedTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🔐 Account Verified Successfully`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Account verified email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending account verified email:', error);
      throw error;
    }
  }

  async sendReferralBonus(data: {
    userEmail: string;
    userName: string;
    referredUser: string;
    bonusAmount: string;
    bonusType: 'tokens' | 'nft' | 'discount';
    referralCode: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('referral-bonus');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateReferralBonusTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🎁 Referral Bonus Earned! ${data.bonusAmount} ${data.bonusType.toUpperCase()}`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Referral bonus email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending referral bonus email:', error);
      throw error;
    }
  }

  async sendFirstStake(data: {
    userEmail: string;
    userName: string;
    stakeAmount: string;
    apy: string;
    stakeDate: string;
    rewards: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('first-stake');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateFirstStakeTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🌱 Congratulations on Your First Stake!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`First stake email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending first stake email:', error);
      throw error;
    }
  }

  async sendFirstNFT(data: {
    userEmail: string;
    userName: string;
    nftName: string;
    tokenId: string;
    category: string;
    rarity: string;
    mintDate: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('first-nft');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateFirstNFTTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🎨 Congratulations on Your First NFT!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`First NFT email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending first NFT email:', error);
      throw error;
    }
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
    
    if (!fs.existsSync(templatePath)) {
      // Return a basic template if the file doesn't exist
      return this.getDefaultTemplate(templateName);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
  }

  private getDefaultTemplate(templateName: string): string {
    const templates: { [key: string]: string } = {
      welcome: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to AGROTM</title>
</head>
<body>
    <h1>Welcome to AGROTM, <%= userName %>!</h1>
    <p>Your agricultural revolution starts here.</p>
    <p>Wallet: <%= walletAddress %></p>
    <p>Signup Date: <%= signupDate %></p>
    <p>User Type: <%= userType %></p>
    <% if (referralCode) { %>
    <p>Referral Code: <%= referralCode %></p>
    <% } %>
</body>
</html>`,
      'kyc-approved': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KYC Approved</title>
</head>
<body>
    <h1>KYC Approved!</h1>
    <p>Congratulations <%= userName %>, your KYC has been approved.</p>
    <p>Level: <%= level %></p>
    <p>Approved At: <%= approvedAt %></p>
</body>
</html>`,
      'kyc-rejected': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KYC Review Required</title>
</head>
<body>
    <h1>KYC Review Required</h1>
    <p>Hello <%= userName %>, your KYC requires attention.</p>
    <p>Reason: <%= reason %></p>
    <h2>Next Steps:</h2>
    <ul>
    <% nextSteps.forEach(function(step) { %>
        <li><%= step %></li>
    <% }); %>
    </ul>
</body>
</html>`
    };

    return templates[templateName] || templates.welcome;
  }

  private renderTemplate(template: string, data: any): string {
    return render(template, {
      ...data,
      currentYear: new Date().getFullYear(),
      platformName: 'AGROTM',
      platformUrl: 'https://agrotm.com',
      supportEmail: 'support@agrotm.com',
      docsUrl: 'https://docs.agrotm.com',
      communityUrl: 'https://community.agrotm.com'
    });
  }

  private generateTextVersion(data: WelcomeEmailData): string {
    return `
🌾 Welcome to AGROTM, ${data.userName}!

Your agricultural revolution starts here! We're excited to have you join the future of farming and DeFi.

Account Details:
- Email: ${data.userEmail}
- Wallet Address: ${data.walletAddress}
- User Type: ${data.userType}
- Signup Date: ${data.signupDate}
- Platform: ${data.platform}

${data.referralCode ? `Referral Code: ${data.referralCode}` : ''}
${data.referredBy ? `Referred By: ${data.referredBy}` : ''}

What's Next?
1. Complete your KYC verification
2. Explore our NFT marketplace
3. Start staking your tokens
4. Join our community

Quick Links:
- Dashboard: https://agrotm.com/dashboard
- Marketplace: https://agrotm.com/marketplace
- Staking: https://agrotm.com/staking
- Documentation: https://docs.agrotm.com
- Community: https://community.agrotm.com

Need Help?
- Support: ${data.preferences?.language === 'pt' ? 'suporte@agrotm.com' : 'support@agrotm.com'}
- FAQ: https://agrotm.com/faq
- Live Chat: Available on our website

Welcome to the future of agriculture!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateKYCApprovedTextVersion(data: any): string {
    return `
✅ KYC Approved!

Congratulations ${data.userName}, your KYC verification has been approved!

Details:
- KYC ID: ${data.kycId}
- Level: ${data.level}
- Approved At: ${data.approvedAt}

You now have full access to all AGROTM features including:
- NFT minting and trading
- Staking and yield farming
- Lending and borrowing
- Enterprise features

Start exploring: https://agrotm.com/dashboard

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateKYCRejectedTextVersion(data: any): string {
    return `
❌ KYC Review Required

Hello ${data.userName}, your KYC verification requires attention.

Details:
- KYC ID: ${data.kycId}
- Rejected At: ${data.rejectedAt}
- Reason: ${data.reason}

Next Steps:
${data.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Please address these issues and resubmit your KYC application.

Need help? Contact support: support@agrotm.com

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateAccountVerifiedTextVersion(data: any): string {
    return `
🔐 Account Verified Successfully

Hello ${data.userName}, your account has been verified successfully!

Details:
- Verification Type: ${data.verificationType}
- Verified At: ${data.verifiedAt}

Your account is now fully verified and secure.

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateReferralBonusTextVersion(data: any): string {
    return `
🎁 Referral Bonus Earned!

Congratulations ${data.userName}, you've earned a referral bonus!

Details:
- Referred User: ${data.referredUser}
- Bonus Amount: ${data.bonusAmount} ${data.bonusType.toUpperCase()}
- Referral Code: ${data.referralCode}

Your bonus has been credited to your account.

Keep referring friends to earn more bonuses!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateFirstStakeTextVersion(data: any): string {
    return `
🌱 Congratulations on Your First Stake!

Hello ${data.userName}, congratulations on making your first stake!

Details:
- Stake Amount: ${data.stakeAmount} AGROTM
- APY: ${data.apy}%
- Stake Date: ${data.stakeDate}
- Expected Rewards: ${data.rewards} AGROTM/year

You're now earning passive income! Keep staking to maximize your returns.

View your staking dashboard: https://agrotm.com/staking

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateFirstNFTTextVersion(data: any): string {
    return `
🎨 Congratulations on Your First NFT!

Hello ${data.userName}, congratulations on minting your first NFT!

Details:
- NFT Name: ${data.nftName}
- Token ID: ${data.tokenId}
- Category: ${data.category}
- Rarity: ${data.rarity}
- Mint Date: ${data.mintDate}

You're now part of the NFT revolution! Explore our marketplace to discover more.

View your NFT: https://agrotm.com/nft/${data.tokenId}

Best regards,
The AGROTM Team
    `.trim();
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<void> {
    const testData: WelcomeEmailData = {
      userEmail: to,
      userName: 'Test User',
      walletAddress: '0x1234567890abcdef',
      signupDate: new Date().toISOString(),
      platform: 'web',
      userType: 'farmer',
      referralCode: 'TEST123',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        notifications: true
      }
    };

    await this.sendWelcomeEmail(testData);
  }
}

// Default email service instance
export const welcomeEmailService = new WelcomeEmailService({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: process.env.SMTP_FROM || 'welcome@agrotm.com'
});

// Convenience functions
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  await welcomeEmailService.sendWelcomeEmail(data);
}

export async function sendKYCApproved(data: any): Promise<void> {
  await welcomeEmailService.sendKYCApproved(data);
}

export async function sendKYCRejected(data: any): Promise<void> {
  await welcomeEmailService.sendKYCRejected(data);
}

export async function sendAccountVerified(data: any): Promise<void> {
  await welcomeEmailService.sendAccountVerified(data);
}

export async function sendReferralBonus(data: any): Promise<void> {
  await welcomeEmailService.sendReferralBonus(data);
}

export async function sendFirstStake(data: any): Promise<void> {
  await welcomeEmailService.sendFirstStake(data);
}

export async function sendFirstNFT(data: any): Promise<void> {
  await welcomeEmailService.sendFirstNFT(data);
}

export default WelcomeEmailService; 