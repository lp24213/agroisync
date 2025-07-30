import nodemailer from 'nodemailer';
import { render } from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

interface NFTMintedData {
  userEmail: string;
  userName: string;
  tokenId: string;
  nftName: string;
  nftDescription: string;
  nftImage: string;
  category: string;
  rarity: string;
  transactionHash: string;
  mintPrice: string;
  gasUsed: string;
  totalCost: string;
  network: string;
  contractAddress: string;
  mintedAt: string;
  farmData?: {
    location: string;
    cropType: string;
    harvestDate: string;
    yield: string;
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

class NFTEmailService {
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

  async sendNFTMinted(data: NFTMintedData): Promise<void> {
    try {
      const template = this.loadTemplate('nft-minted');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🎉 Your NFT "${data.nftName}" has been minted successfully!`,
        html: htmlContent,
        text: textContent,
        attachments: [
          {
            filename: 'nft-details.json',
            content: JSON.stringify({
              tokenId: data.tokenId,
              name: data.nftName,
              description: data.nftDescription,
              category: data.category,
              rarity: data.rarity,
              transactionHash: data.transactionHash,
              contractAddress: data.contractAddress,
              mintedAt: data.mintedAt
            }, null, 2)
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`NFT minted email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending NFT minted email:', error);
      throw error;
    }
  }

  async sendNFTListed(data: {
    userEmail: string;
    userName: string;
    tokenId: string;
    nftName: string;
    listingPrice: string;
    listingId: string;
    expiresAt: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('nft-listed');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateListingTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `📈 Your NFT "${data.nftName}" is now listed for sale!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`NFT listed email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending NFT listed email:', error);
      throw error;
    }
  }

  async sendNFTSold(data: {
    userEmail: string;
    userName: string;
    tokenId: string;
    nftName: string;
    salePrice: string;
    buyerAddress: string;
    transactionHash: string;
    royalties: string;
    platformFee: string;
    netAmount: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('nft-sold');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateSoldTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `💰 Congratulations! Your NFT "${data.nftName}" has been sold!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`NFT sold email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending NFT sold email:', error);
      throw error;
    }
  }

  async sendNFTBidReceived(data: {
    userEmail: string;
    userName: string;
    tokenId: string;
    nftName: string;
    bidAmount: string;
    bidderAddress: string;
    expiresAt: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('nft-bid-received');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateBidTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `💎 New bid received for your NFT "${data.nftName}"!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`NFT bid received email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending NFT bid received email:', error);
      throw error;
    }
  }

  async sendCollectionCreated(data: {
    userEmail: string;
    userName: string;
    collectionName: string;
    collectionDescription: string;
    collectionImage: string;
    contractAddress: string;
    totalSupply: number;
    category: string;
  }): Promise<void> {
    try {
      const template = this.loadTemplate('collection-created');
      const htmlContent = this.renderTemplate(template, data);
      const textContent = this.generateCollectionTextVersion(data);

      const mailOptions = {
        from: this.config.from,
        to: data.userEmail,
        subject: `🏗️ Your collection "${data.collectionName}" has been created!`,
        html: htmlContent,
        text: textContent
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Collection created email sent to ${data.userEmail}`);
    } catch (error) {
      console.error('Error sending collection created email:', error);
      throw error;
    }
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
  }

  private renderTemplate(template: string, data: any): string {
    return render(template, {
      ...data,
      currentYear: new Date().getFullYear(),
      platformName: 'AGROTM',
      platformUrl: 'https://agrotm.com',
      supportEmail: 'support@agrotm.com'
    });
  }

  private generateTextVersion(data: NFTMintedData): string {
    return `
🎉 Congratulations! Your NFT has been minted successfully!

NFT Details:
- Name: ${data.nftName}
- Token ID: ${data.tokenId}
- Category: ${data.category}
- Rarity: ${data.rarity}
- Description: ${data.nftDescription}

Transaction Details:
- Transaction Hash: ${data.transactionHash}
- Network: ${data.network}
- Contract Address: ${data.contractAddress}
- Mint Price: ${data.mintPrice} ETH
- Gas Used: ${data.gasUsed} ETH
- Total Cost: ${data.totalCost} ETH
- Minted At: ${data.mintedAt}

${data.farmData ? `
Farm Data:
- Location: ${data.farmData.location}
- Crop Type: ${data.farmData.cropType}
- Harvest Date: ${data.farmData.harvestDate}
- Expected Yield: ${data.farmData.yield}
` : ''}

View your NFT: https://agrotm.com/nft/${data.tokenId}

Thank you for using AGROTM!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateListingTextVersion(data: any): string {
    return `
📈 Your NFT has been listed for sale!

NFT Details:
- Name: ${data.nftName}
- Token ID: ${data.tokenId}
- Listing Price: ${data.listingPrice} ETH
- Listing ID: ${data.listingId}
- Expires At: ${data.expiresAt}

View your listing: https://agrotm.com/marketplace/${data.listingId}

Thank you for using AGROTM!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateSoldTextVersion(data: any): string {
    return `
💰 Congratulations! Your NFT has been sold!

NFT Details:
- Name: ${data.nftName}
- Token ID: ${data.tokenId}
- Sale Price: ${data.salePrice} ETH
- Buyer: ${data.buyerAddress}
- Transaction Hash: ${data.transactionHash}

Payment Breakdown:
- Sale Price: ${data.salePrice} ETH
- Platform Fee: ${data.platformFee} ETH
- Royalties: ${data.royalties} ETH
- Net Amount: ${data.netAmount} ETH

Thank you for using AGROTM!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateBidTextVersion(data: any): string {
    return `
💎 New bid received for your NFT!

NFT Details:
- Name: ${data.nftName}
- Token ID: ${data.tokenId}
- Bid Amount: ${data.bidAmount} ETH
- Bidder: ${data.bidderAddress}
- Expires At: ${data.expiresAt}

Accept or reject the bid: https://agrotm.com/nft/${data.tokenId}/bids

Thank you for using AGROTM!

Best regards,
The AGROTM Team
    `.trim();
  }

  private generateCollectionTextVersion(data: any): string {
    return `
🏗️ Your collection has been created!

Collection Details:
- Name: ${data.collectionName}
- Description: ${data.collectionDescription}
- Category: ${data.category}
- Total Supply: ${data.totalSupply}
- Contract Address: ${data.contractAddress}

View your collection: https://agrotm.com/collections/${data.contractAddress}

Thank you for using AGROTM!

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
    const testData: NFTMintedData = {
      userEmail: to,
      userName: 'Test User',
      tokenId: 'AGROTM-TEST-123',
      nftName: 'Test Farm Land',
      nftDescription: 'This is a test NFT for email verification',
      nftImage: 'ipfs://test-image-hash',
      category: 'Farm Land',
      rarity: 'Common',
      transactionHash: '0x1234567890abcdef',
      mintPrice: '0.01',
      gasUsed: '0.005',
      totalCost: '0.015',
      network: 'Ethereum',
      contractAddress: '0xabcdef1234567890',
      mintedAt: new Date().toISOString(),
      farmData: {
        location: 'Test Farm, Test State',
        cropType: 'Corn',
        harvestDate: '2024-10-15',
        yield: '100 tons'
      }
    };

    await this.sendNFTMinted(testData);
  }
}

// Default email service instance
export const nftEmailService = new NFTEmailService({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: process.env.SMTP_FROM || 'noreply@agrotm.com'
});

// Convenience functions
export async function sendNFTMinted(data: NFTMintedData): Promise<void> {
  await nftEmailService.sendNFTMinted(data);
}

export async function sendNFTListed(data: any): Promise<void> {
  await nftEmailService.sendNFTListed(data);
}

export async function sendNFTSold(data: any): Promise<void> {
  await nftEmailService.sendNFTSold(data);
}

export async function sendNFTBidReceived(data: any): Promise<void> {
  await nftEmailService.sendNFTBidReceived(data);
}

export async function sendCollectionCreated(data: any): Promise<void> {
  await nftEmailService.sendCollectionCreated(data);
}

export default NFTEmailService; 