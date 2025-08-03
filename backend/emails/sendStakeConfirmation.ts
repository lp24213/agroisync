import nodemailer from 'nodemailer';
import { render } from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

interface StakeConfirmationData {
  userEmail: string;
  userName: string;
  stakeAmount: string;
  lockPeriod: number;
  apy: number;
  expectedRewards: string;
  stakeDate: string;
  unlockDate: string;
  transactionHash: string;
  walletAddress: string;
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
  replyTo?: string;
}

class EmailService {
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

  /**
   * Send stake confirmation email
   */
  async sendStakeConfirmation(data: StakeConfirmationData): Promise<void> {
    try {
      const template = this.loadTemplate('stake-confirmation');
      const html = this.renderTemplate(template, data);
      const text = this.generateTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        replyTo: this.config.replyTo || this.config.from,
        subject: `Stake Confirmation - ${data.stakeAmount} AGRO`,
        html,
        text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Stake confirmation email sent to ${data.userEmail}`);
      
    } catch (error) {
      console.error('❌ Failed to send stake confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send unstake confirmation email
   */
  async sendUnstakeConfirmation(data: {
    userEmail: string;
    userName: string;
    unstakeAmount: string;
    rewardsEarned: string;
    totalReturn: string;
    stakeDuration: number;
    transactionHash: string;
    walletAddress: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('unstake-confirmation');
      const html = this.renderTemplate(template, data);
      const text = this.generateUnstakeTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        replyTo: this.config.replyTo || this.config.from,
        subject: `Unstake Confirmation - ${data.unstakeAmount} AGRO`,
        html,
        text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Unstake confirmation email sent to ${data.userEmail}`);
      
    } catch (error) {
      console.error('❌ Failed to send unstake confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send rewards claim confirmation email
   */
  async sendRewardsClaimConfirmation(data: {
    userEmail: string;
    userName: string;
    claimedAmount: string;
    totalStaked: string;
    currentAPY: number;
    nextRewardDate: string;
    transactionHash: string;
    walletAddress: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('rewards-claim-confirmation');
      const html = this.renderTemplate(template, data);
      const text = this.generateRewardsClaimTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        replyTo: this.config.replyTo || this.config.from,
        subject: `Rewards Claimed - ${data.claimedAmount} AGRO`,
        html,
        text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Rewards claim confirmation email sent to ${data.userEmail}`);
      
    } catch (error) {
      console.error('❌ Failed to send rewards claim confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send staking reminder email
   */
  async sendStakingReminder(data: {
    userEmail: string;
    userName: string;
    stakedAmount: string;
    rewardsEarned: string;
    daysUntilUnlock: number;
    currentAPY: number;
    walletAddress: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('staking-reminder');
      const html = this.renderTemplate(template, data);
      const text = this.generateStakingReminderTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        replyTo: this.config.replyTo || this.config.from,
        subject: `Staking Reminder - Your ${data.stakedAmount} AGRO`,
        html,
        text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Staking reminder email sent to ${data.userEmail}`);
      
    } catch (error) {
      console.error('❌ Failed to send staking reminder email:', error);
      throw error;
    }
  }

  /**
   * Load email template
   */
  private loadTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    return fs.readFileSync(templatePath, 'utf8');
  }

  /**
   * Render template with data
   */
  private renderTemplate(template: string, data: any): string {
    return render(template, {
      ...data,
      currentYear: new Date().getFullYear(),
      appName: 'AGROTM',
      appUrl: process.env.APP_URL || 'https://agrotm.com',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@agrotm.com',
      logoUrl: process.env.LOGO_URL || 'https://agrotm.com/logo.png'
    });
  }

  /**
   * Generate text version for stake confirmation
   */
  private generateTextVersion(data: StakeConfirmationData): string {
    return `
AGROTM - Stake Confirmation

Hello ${data.userName},

Your stake has been successfully confirmed!

Stake Details:
- Amount: ${data.stakeAmount} AGRO
- Lock Period: ${data.lockPeriod} days
- APY: ${data.apy}%
- Expected Rewards: ${data.expectedRewards} AGRO
- Stake Date: ${data.stakeDate}
- Unlock Date: ${data.unlockDate}

Transaction Hash: ${data.transactionHash}
Wallet Address: ${data.walletAddress}

You can track your stake and rewards in your dashboard at ${process.env.APP_URL || 'https://agrotm.com'}/dashboard

Thank you for staking with AGROTM!

Best regards,
The AGROTM Team

---
This is an automated message. Please do not reply to this email.
For support, contact us at ${process.env.SUPPORT_EMAIL || 'support@agrotm.com'}
    `.trim();
  }

  /**
   * Generate text version for unstake confirmation
   */
  private generateUnstakeTextVersion(data: any): string {
    return `
AGROTM - Unstake Confirmation

Hello ${data.userName},

Your unstake has been successfully processed!

Unstake Details:
- Amount: ${data.unstakeAmount} AGRO
- Rewards Earned: ${data.rewardsEarned} AGRO
- Total Return: ${data.totalReturn} AGRO
- Stake Duration: ${data.stakeDuration} days

Transaction Hash: ${data.transactionHash}
Wallet Address: ${data.walletAddress}

Your tokens have been returned to your wallet. Thank you for staking with AGROTM!

Best regards,
The AGROTM Team

---
This is an automated message. Please do not reply to this email.
For support, contact us at ${process.env.SUPPORT_EMAIL || 'support@agrotm.com'}
    `.trim();
  }

  /**
   * Generate text version for rewards claim confirmation
   */
  private generateRewardsClaimTextVersion(data: any): string {
    return `
AGROTM - Rewards Claim Confirmation

Hello ${data.userName},

Your rewards have been successfully claimed!

Claim Details:
- Claimed Amount: ${data.claimedAmount} AGRO
- Total Staked: ${data.totalStaked} AGRO
- Current APY: ${data.currentAPY}%
- Next Reward Date: ${data.nextRewardDate}

Transaction Hash: ${data.transactionHash}
Wallet Address: ${data.walletAddress}

Your rewards have been sent to your wallet. Keep staking to earn more rewards!

Best regards,
The AGROTM Team

---
This is an automated message. Please do not reply to this email.
For support, contact us at ${process.env.SUPPORT_EMAIL || 'support@agrotm.com'}
    `.trim();
  }

  /**
   * Generate text version for staking reminder
   */
  private generateStakingReminderTextVersion(data: any): string {
    return `
AGROTM - Staking Reminder

Hello ${data.userName},

This is a friendly reminder about your active stake.

Stake Details:
- Staked Amount: ${data.stakedAmount} AGRO
- Rewards Earned: ${data.rewardsEarned} AGRO
- Days Until Unlock: ${data.daysUntilUnlock}
- Current APY: ${data.currentAPY}%

Wallet Address: ${data.walletAddress}

You can claim your rewards or check your stake status in your dashboard at ${process.env.APP_URL || 'https://agrotm.com'}/dashboard

Thank you for being part of the AGROTM community!

Best regards,
The AGROTM Team

---
This is an automated message. Please do not reply to this email.
For support, contact us at ${process.env.SUPPORT_EMAIL || 'support@agrotm.com'}
    `.trim();
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(to: string): Promise<void> {
    const testData: StakeConfirmationData = {
      userEmail: to,
      userName: 'Test User',
      stakeAmount: '1000',
      lockPeriod: 90,
      apy: 12.5,
      expectedRewards: '125',
      stakeDate: new Date().toISOString(),
      unlockDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
      walletAddress: '0x1234567890123456789012345678901234567890'
    };

    await this.sendStakeConfirmation(testData);
  }
}

// Create email service instance
export const emailService = new EmailService({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  },
  from: process.env.EMAIL_FROM || 'noreply@agrotm.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@agrotm.com'
});

// Export main function for stake confirmation
export async function sendStakeConfirmation(data: StakeConfirmationData): Promise<void> {
  return emailService.sendStakeConfirmation(data);
}

// Export other functions
export async function sendUnstakeConfirmation(data: any): Promise<void> {
  return emailService.sendUnstakeConfirmation(data);
}

export async function sendRewardsClaimConfirmation(data: any): Promise<void> {
  return emailService.sendRewardsClaimConfirmation(data);
}

export async function sendStakingReminder(data: any): Promise<void> {
  return emailService.sendStakingReminder(data);
}

export default EmailService; 