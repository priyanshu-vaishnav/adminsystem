require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sendApprovalEmail, sendRejectionEmail } = require("./mailer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("email backend is running");
});

app.post("/api/send-approval-email", async (req, res) => {
  const { email, fullName, username } = req.body;
  if (!email || !fullName) {
    return res
      .status(400)
      .json({ success: false, error: "email and fullName are required" });
  }
  const result = await sendApprovalEmail(email, fullName, username);
  res.json(result);
});

app.post("/api/send-rejection-email", async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) {
    return res
      .status(400)
      .json({ success: false, error: "email and fullName are required" });
  }
  const result = await sendRejectionEmail(email, fullName);
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Wickbund email backend running on port ${PORT}`);
});
