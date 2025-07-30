import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadConfig {
  provider: 's3' | 'local' | 'ipfs' | 'cloudinary';
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  localPath?: string;
  maxFileSize?: number;
  allowedTypes?: string[];
  publicUrl?: string;
}

export interface UploadResult {
  id: string;
  url: string;
  key: string;
  size: number;
  mimeType: string;
  hash: string;
  metadata: Record<string, any>;
}

export interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  hash: string;
  uploadedBy: string;
  category: 'kyc' | 'nft' | 'certificate' | 'document' | 'image' | 'video';
  tags?: string[];
  description?: string;
}

class UploadService {
  private config: UploadConfig;
  private s3Client?: S3Client;

  constructor(config: UploadConfig) {
    this.config = {
      maxFileSize: 10 * 1024 * 1024, // 10MB default
      allowedTypes: ['image/*', 'video/*', 'application/pdf', 'text/*'],
      ...config
    };

    if (this.config.provider === 's3' && this.config.accessKeyId && this.config.secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.config.region || 'us-east-1',
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey
        }
      });
    }
  }

  /**
   * Upload a file from buffer
   */
  async uploadBuffer(
    buffer: Buffer,
    metadata: FileMetadata
  ): Promise<UploadResult> {
    // Validate file
    this.validateFile(buffer, metadata);

    // Generate unique ID and key
    const id = uuidv4();
    const key = this.generateKey(metadata.category, id, metadata.originalName);

    // Calculate hash
    const hash = this.calculateHash(buffer);

    // Upload based on provider
    let url: string;
    switch (this.config.provider) {
      case 's3':
        url = await this.uploadToS3(buffer, key, metadata);
        break;
      case 'local':
        url = await this.uploadToLocal(buffer, key, metadata);
        break;
      case 'ipfs':
        url = await this.uploadToIPFS(buffer, key, metadata);
        break;
      case 'cloudinary':
        url = await this.uploadToCloudinary(buffer, key, metadata);
        break;
      default:
        throw new Error(`Unsupported upload provider: ${this.config.provider}`);
    }

    return {
      id,
      url,
      key,
      size: buffer.length,
      mimeType: metadata.mimeType,
      hash,
      metadata: {
        originalName: metadata.originalName,
        category: metadata.category,
        uploadedBy: metadata.uploadedBy,
        tags: metadata.tags || [],
        description: metadata.description,
        uploadedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Upload a file from file path
   */
  async uploadFile(filePath: string, metadata: FileMetadata): Promise<UploadResult> {
    const buffer = fs.readFileSync(filePath);
    return this.uploadBuffer(buffer, metadata);
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: Array<{ buffer: Buffer; metadata: FileMetadata }>
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadBuffer(file.buffer, file.metadata);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.metadata.originalName}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Get a signed URL for direct upload
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (this.config.provider !== 's3' || !this.s3Client) {
      throw new Error('Signed URLs are only supported for S3');
    }

    const command = new PutObjectCommand({
      Bucket: this.config.bucket!,
      Key: key,
      ContentType: contentType
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Get a signed URL for file download
   */
  async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (this.config.provider !== 's3' || !this.s3Client) {
      throw new Error('Signed URLs are only supported for S3');
    }

    const command = new GetObjectCommand({
      Bucket: this.config.bucket!,
      Key: key
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete a file
   */
  async deleteFile(key: string): Promise<void> {
    switch (this.config.provider) {
      case 's3':
        await this.deleteFromS3(key);
        break;
      case 'local':
        await this.deleteFromLocal(key);
        break;
      case 'ipfs':
        await this.deleteFromIPFS(key);
        break;
      case 'cloudinary':
        await this.deleteFromCloudinary(key);
        break;
      default:
        throw new Error(`Unsupported upload provider: ${this.config.provider}`);
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(buffer: Buffer, metadata: FileMetadata): void {
    // Check file size
    if (this.config.maxFileSize && buffer.length > this.config.maxFileSize) {
      throw new Error(`File size ${buffer.length} exceeds maximum allowed size ${this.config.maxFileSize}`);
    }

    // Check file type
    if (this.config.allowedTypes && !this.isAllowedType(metadata.mimeType)) {
      throw new Error(`File type ${metadata.mimeType} is not allowed`);
    }

    // Validate metadata
    if (!metadata.originalName || !metadata.mimeType || !metadata.uploadedBy) {
      throw new Error('Missing required metadata fields');
    }
  }

  /**
   * Check if file type is allowed
   */
  private isAllowedType(mimeType: string): boolean {
    if (!this.config.allowedTypes) return true;

    return this.config.allowedTypes.some(allowedType => {
      if (allowedType.endsWith('/*')) {
        const baseType = allowedType.slice(0, -2);
        return mimeType.startsWith(baseType);
      }
      return mimeType === allowedType;
    });
  }

  /**
   * Generate unique key for file
   */
  private generateKey(category: string, id: string, originalName: string): string {
    const extension = path.extname(originalName);
    const timestamp = Date.now();
    return `${category}/${timestamp}/${id}${extension}`;
  }

  /**
   * Calculate file hash
   */
  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Upload to AWS S3
   */
  private async uploadToS3(buffer: Buffer, key: string, metadata: FileMetadata): Promise<string> {
    if (!this.s3Client || !this.config.bucket) {
      throw new Error('S3 configuration is missing');
    }

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      Body: buffer,
      ContentType: metadata.mimeType,
      Metadata: {
        originalName: metadata.originalName,
        uploadedBy: metadata.uploadedBy,
        category: metadata.category,
        hash: this.calculateHash(buffer)
      }
    });

    await this.s3Client.send(command);
    return `https://${this.config.bucket}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${key}`;
  }

  /**
   * Upload to local filesystem
   */
  private async uploadToLocal(buffer: Buffer, key: string, metadata: FileMetadata): Promise<string> {
    if (!this.config.localPath) {
      throw new Error('Local upload path is not configured');
    }

    const fullPath = path.join(this.config.localPath, key);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, buffer);

    // Return public URL
    return this.config.publicUrl ? `${this.config.publicUrl}/${key}` : fullPath;
  }

  /**
   * Upload to IPFS
   */
  private async uploadToIPFS(buffer: Buffer, key: string, metadata: FileMetadata): Promise<string> {
    // This would integrate with IPFS client
    // For now, returning a mock IPFS hash
    const ipfsHash = this.calculateHash(buffer).slice(0, 46); // IPFS hash length
    return `ipfs://${ipfsHash}`;
  }

  /**
   * Upload to Cloudinary
   */
  private async uploadToCloudinary(buffer: Buffer, key: string, metadata: FileMetadata): Promise<string> {
    // This would integrate with Cloudinary SDK
    // For now, returning a mock Cloudinary URL
    return `https://res.cloudinary.com/agrotm/image/upload/v1/${key}`;
  }

  /**
   * Delete from S3
   */
  private async deleteFromS3(key: string): Promise<void> {
    if (!this.s3Client || !this.config.bucket) {
      throw new Error('S3 configuration is missing');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key
    });

    await this.s3Client.send(command);
  }

  /**
   * Delete from local filesystem
   */
  private async deleteFromLocal(key: string): Promise<void> {
    if (!this.config.localPath) {
      throw new Error('Local upload path is not configured');
    }

    const fullPath = path.join(this.config.localPath, key);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  /**
   * Delete from IPFS
   */
  private async deleteFromIPFS(key: string): Promise<void> {
    // IPFS files are immutable, so we just log the deletion
    console.log(`IPFS file deletion requested for key: ${key}`);
  }

  /**
   * Delete from Cloudinary
   */
  private async deleteFromCloudinary(key: string): Promise<void> {
    // This would integrate with Cloudinary SDK
    console.log(`Cloudinary file deletion requested for key: ${key}`);
  }

  /**
   * Get file info
   */
  async getFileInfo(key: string): Promise<FileMetadata | null> {
    switch (this.config.provider) {
      case 's3':
        return this.getS3FileInfo(key);
      case 'local':
        return this.getLocalFileInfo(key);
      default:
        return null;
    }
  }

  /**
   * Get S3 file info
   */
  private async getS3FileInfo(key: string): Promise<FileMetadata | null> {
    if (!this.s3Client || !this.config.bucket) {
      return null;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key
      });

      const response = await this.s3Client.send(command);
      
      if (!response.Metadata) {
        return null;
      }

      return {
        originalName: response.Metadata.originalName || '',
        mimeType: response.ContentType || '',
        size: response.ContentLength || 0,
        hash: response.Metadata.hash || '',
        uploadedBy: response.Metadata.uploadedBy || '',
        category: (response.Metadata.category as any) || 'document'
      };
    } catch (error) {
      console.error('Error getting S3 file info:', error);
      return null;
    }
  }

  /**
   * Get local file info
   */
  private async getLocalFileInfo(key: string): Promise<FileMetadata | null> {
    if (!this.config.localPath) {
      return null;
    }

    const fullPath = path.join(this.config.localPath, key);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const stats = fs.statSync(fullPath);
    const buffer = fs.readFileSync(fullPath);

    return {
      originalName: path.basename(key),
      mimeType: this.getMimeType(key),
      size: stats.size,
      hash: this.calculateHash(buffer),
      uploadedBy: 'system',
      category: 'document'
    };
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}

// Factory function to create upload service
export function createUploadService(config: UploadConfig): UploadService {
  return new UploadService(config);
}

// Default upload service instance
export const uploadService = createUploadService({
  provider: (process.env.UPLOAD_PROVIDER as any) || 'local',
  bucket: process.env.AWS_S3_BUCKET,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  localPath: process.env.UPLOAD_LOCAL_PATH || './uploads',
  maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '10485760'), // 10MB
  allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/*', 'video/*', 'application/pdf'],
  publicUrl: process.env.UPLOAD_PUBLIC_URL
});

export default UploadService; 