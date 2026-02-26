Here is your **properly formatted README.md markdown source code**.
You can copy-paste this directly into your `README.md` file.

It contains clean formatting, headings, code blocks, and tables.

---

````markdown
# 📦 mongo-s3-like

A lightweight **S3-like file storage engine** built on top of MongoDB.

It allows applications to:

- Upload files
- Retrieve files via URL
- Delete files
- Store metadata
- Use their own MongoDB connection

Designed conceptually similar to Amazon S3, but backed by MongoDB.

---

# 🚀 Features

- Pluggable MongoDB connection
- Binary file storage
- URL generation
- File validation
- Metadata storage
- Clean architecture (Repository + Service pattern)
- Production-ready structure

---

# 📦 Installation

```bash
npm install mongo-s3-like
````

### Required peer dependencies

```bash
npm install express multer mongoose
```

---

# 🧠 How It Works

```
File Upload
    ↓
Validation
    ↓
MongoDB Storage (Buffer)
    ↓
Generated Public URL
```

Each file is stored as:

```json
{
  "_id": "...",
  "key": "uuid.jpg",
  "filename": "image.jpg",
  "contentType": "image/jpeg",
  "size": 20480,
  "hash": "sha256hash",
  "data": "<Binary>",
  "createdAt": "..."
}
```

---

# 🛠 Basic Usage

## 1️⃣ Initialize Storage Engine

```js
const { StorageEngine } = require("mongo-s3-like");

const storage = new StorageEngine({
  mongoUrl: "mongodb://localhost:27017",
  dbName: "userStorageDB",
  baseUrl: "http://localhost:3000/files",
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png"]
});

await storage.init();
```

---

## 2️⃣ Express Integration Example

```js
const express = require("express");
const multer = require("multer");
const { StorageEngine } = require("mongo-s3-like");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const storage = new StorageEngine({
  mongoUrl: "mongodb://localhost:27017",
  dbName: "userStorageDB",
  baseUrl: "http://localhost:3000/files"
});

await storage.init();

app.post("/upload", upload.single("file"), async (req, res) => {
  const result = await storage.upload(req.file);
  res.status(201).json(result);
});

app.get("/files/:id", async (req, res) => {
  const file = await storage.get(req.params.id);

  res.set({
    "Content-Type": file.contentType,
    "Content-Length": file.size
  });

  res.end(file.data);
});

app.delete("/files/:id", async (req, res) => {
  await storage.delete(req.params.id);
  res.json({ success: true });
});

app.listen(3000);
```

---

# 📬 API Methods

## `storage.upload(file)`

Uploads a file.

### Parameters

* `file` (multer file object)

### Returns

```json
{
  "id": "fileId",
  "key": "generatedKey.jpg",
  "url": "http://localhost:3000/files/fileId"
}
```

---

## `storage.get(fileId)`

Fetch file metadata + binary.

### Returns

```json
{
  "_id": "...",
  "filename": "...",
  "contentType": "...",
  "size": 1234,
  "data": "<Buffer>"
}
```

---

## `storage.delete(fileId)`

Deletes file.

Returns:

```json
true
```

---

# 🧪 Testing with Postman

### Upload

```
POST http://localhost:3000/upload
Body → form-data
Key: file
Type: File
```

### Get File

```
GET http://localhost:3000/files/:id
```

### Delete File

```
DELETE http://localhost:3000/files/:id
```

---

# ⚙ Configuration Options

| Option           | Required | Description                 |
| ---------------- | -------- | --------------------------- |
| mongoUrl         | ✅        | MongoDB connection string   |
| dbName           | ✅        | Database name               |
| baseUrl          | ✅        | Base URL for file access    |
| maxFileSize      | ❌        | Max file size (default 5MB) |
| allowedMimeTypes | ❌        | Allowed content types       |

---

# 🔐 Production Recommendations

### ⚠ Memory Storage Warning

Using:

```js
multer.memoryStorage()
```

Means:

* Entire file loads into RAM
* Not ideal for large files

For large file support (>16MB), consider using MongoDB GridFS.

---

# 📈 Scaling Considerations

| Scenario               | Recommended Upgrade        |
| ---------------------- | -------------------------- |
| >16MB files            | GridFS                     |
| High traffic           | CDN                        |
| Global access          | Object storage             |
| Encryption requirement | Encrypt buffer before save |

---

# 🏗 Architecture

```
StorageEngine
     ↓
FileService
     ↓
FileRepository
     ↓
MongoDB
```

Separation of concerns:

* Business logic
* Validation
* Data persistence
* URL abstraction

---

# 📄 License

MIT

---

# 🔥 Future Roadmap

* GridFS adapter
* Signed URLs
* File versioning
* Encryption at rest
* Multi-bucket support
* Pluggable storage engines





