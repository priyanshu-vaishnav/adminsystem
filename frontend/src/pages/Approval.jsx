import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import Layout from "../components/Layout";

export default function Approval() {
  const [indents, setIndents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) checkRoleAndFetch();
  }, [user]);

  const checkRoleAndFetch = async () => {
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(prof);
    setChecking(false);
    if (prof?.role === "admin") fetchIndents();
  };

  const fetchIndents = async () => {
    const { data, error } = await supabase
      .from("indents")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setIndents(data);
  };

  const updateStatus = async (id, status, indent) => {
    if (status === "approved") {
      // Create the real auth account only when approved
      const { error: signUpError } = await supabase.auth.signUp({
        email: indent.email,
        password: indent.password,
        options: {
          data: { name: indent.full_name, username: indent.username },
        },
      });
      if (signUpError) {
        alert("Could not create user: " + signUpError.message);
        return;
      }
    }
    await supabase.from("indents").update({ status }).eq("id", id);

    // Fire-and-forget email notification (does not block UI if it fails)
    const endpoint =
      status === "approved" ? "send-approval-email" : "send-rejection-email";
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: indent.email,
        fullName: indent.full_name,
        username: indent.username,
      }),
    }).catch((err) => console.error("Email notification failed:", err));

    fetchIndents();
  };

  const badgeStyle = (status) => ({
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#fff",
    background:
      status === "pending"
        ? "#f59e0b"
        : status === "approved"
          ? "#16a34a"
          : "#dc2626",
  });

  return (
    <Layout>
      <h1>Approval Queue</h1>
      {checking ? (
        <p>Checking access...</p>
      ) : profile?.role !== "admin" ? (
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            marginTop: "20px",
          }}
        >
          <p style={{ color: "#dc2626" }}>
            Access denied. Only admins can view the approval queue.
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: "20px",
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f1f5" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>
                  Full Name
                </th>
                <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {indents.map((ind) => (
                <tr key={ind.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{ind.full_name}</td>
                  <td style={{ padding: "12px" }}>{ind.username}</td>
                  <td style={{ padding: "12px" }}>{ind.email}</td>
                  <td style={{ padding: "12px" }}>{ind.role}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={badgeStyle(ind.status)}>{ind.status}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {ind.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(ind.id, "approved", ind)}
                          style={{
                            marginRight: "8px",
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(ind.id, "rejected", ind)}
                          style={{
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
