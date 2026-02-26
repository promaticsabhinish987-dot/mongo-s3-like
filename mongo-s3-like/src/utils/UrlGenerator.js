class UrlGenerator {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error("baseUrl is required");
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  createUrl(fileId) {
    return `${this.baseUrl}/${fileId}`;
  }
}

module.exports = UrlGenerator;