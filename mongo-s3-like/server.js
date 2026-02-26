const express = require("express");
const multer = require("multer");
// const { StorageEngine } = require("mongo-s3-like");
const {StorageEngine}=require("./src/index")

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const storage = new StorageEngine({
  mongoUrl: "mongodb://localhost:27017",
  dbName: "userStorageDB",
  baseUrl: "http://localhost:3000/files"
});

(async () => {
  await storage.init();
})();

// Upload

app.post("/upload", upload.single("file"), async (req, res) => {
  const result = await storage.upload(req.file);
  res.json(result);
});


// Get File (binary)
app.get("/files/:id", async (req, res) => {
  const file = await storage.get(req.params.id);
  res.set("Content-Type", file.contentType);
  res.send(file.data);
});


// Delete
app.delete("/files/:id", async (req, res) => {
  await storage.delete(req.params.id);

  res.json({
    success: true,
    message: "File deleted successfully"
  });
})


// Metadata
app.get("/files/:id/meta", async (req, res) => {
  const file = await storage.get(req.params.id);

  res.json({
    id: file._id,
    filename: file.filename,
    size: file.size,
    contentType: file.contentType,
    createdAt: file.createdAt
  });
})

app.listen(3000,()=>{
   console.log("your server is running at port 3000")
});