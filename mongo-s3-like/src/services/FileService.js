const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

class FileService {
  constructor(config) {
    this.maxFileSize = config.maxFileSize || 5 * 1024 * 1024;
    this.allowedMimeTypes =
      config.allowedMimeTypes || ["image/jpeg", "image/png", "image/webp"];
  }

  validateFile(file) {
    if (!file) throw new Error("File is required");

    if (file.size > this.maxFileSize) {
      throw new Error("File exceeds maximum allowed size");
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Unsupported file type");
    }
  }

  generateKey(originalName) {
    const extension = originalName.split(".").pop();
    return `${uuidv4()}.${extension}`;
  }

  calculateHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
  }
}

module.exports = FileService;