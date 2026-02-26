const mongoose = require("mongoose");
const FileService = require("../services/FileService");
const FileRepository = require("../repository/FileRepository");
const UrlGenerator = require("../utils/UrlGenerator");

class StorageEngine {
  constructor(config) {
    if (!config.mongoUrl || !config.dbName || !config.baseUrl) {
      throw new Error("mongoUrl, dbName and baseUrl are required");
    }

    this.config = config;
    this.connection = null;
  }

  async init() {
    this.connection = await mongoose.createConnection(this.config.mongoUrl, {
      dbName: this.config.dbName
    });

    this.fileService = new FileService(this.config);
    this.fileRepository = new FileRepository(this.connection);
    this.urlGenerator = new UrlGenerator(this.config.baseUrl);
  }

  async upload(file) {
    this.fileService.validateFile(file);

    const key = this.fileService.generateKey(file.originalname);
    const hash = this.fileService.calculateHash(file.buffer);

    const saved = await this.fileRepository.save({
      key,
      filename: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      hash,
      data: file.buffer
    });

    return {
      id: saved._id,
      key,
      url: this.urlGenerator.createUrl(saved._id)
    };
  }

  async get(fileId) {
    const file = await this.fileRepository.findById(fileId);
    if (!file) throw new Error("File not found");
    return file;
  }

  async delete(fileId) {
    const file = await this.fileRepository.delete(fileId);
    if (!file) throw new Error("File not found");
    return true;
  }
}

module.exports = StorageEngine;