import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";

export default function IndentForm() {
  //all states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Indent = new user onboarding request. Stored as pending,
    // actual auth account only gets created when admin approves it.
    const { error } = await supabase.from("indents").insert({
      full_name: fullName,
      username,
      email,
      password, // plain text only for demo; real system should never store this
      status: "pending",
    });
    if (error) setMessage("Error: " + error.message);
    else {
      setMessage("Indent submitted successfully! Waiting for approval.");
      setFullName("");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <Layout>
      <h1>New Indent (User Onboarding Request)</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "420px",
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          marginTop: "16px",
        }}
      >
        {message && (
          <p style={{ color: message.startsWith("Error") ? "red" : "green" }}>
            {message}
          </p>
        )}
        <label>Full Name</label>
        <input
          style={inputStyle}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label>Username</label>
        <input
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>password</label>
        <input
          type="password "
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit Indent
        </button>
      </form>
    </Layout>
  );
}
