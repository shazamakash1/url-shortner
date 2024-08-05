import path from "path";
import express from "express";
import dotenv from "dotenv";

const PORT = process.env.PORT || 5000;
dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
