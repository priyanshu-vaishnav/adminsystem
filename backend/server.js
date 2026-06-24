require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { sendApprovalEmail, sendRejectionEmail } = require("./mailer");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("email backend is running");
});

app.post("/api/create-user", async (req, res) => {
  const { email, password, fullName, username } = req.body;

  if (!email || !password || !fullName || !username) {
    return res.status(400).json({
      success: false,
      error: "email, password, fullName, and username are required",
    });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      success: false,
      error: "Server is not configured with Supabase service role credentials",
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: fullName,
      username,
    },
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  res.json({ success: true, data });
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
