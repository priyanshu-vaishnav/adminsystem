import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Sidebar() {
  const { signOut, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) checkRole();
  }, [user]);

  const checkRole = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    setIsAdmin(data?.role === "admin");
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 20px",
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "#4f46e5" : "transparent",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "6px",
    fontSize: "15px",
  });

  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#1e1b2e",
        padding: "24px 14px",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      <h2
        style={{ marginBottom: "30px", fontSize: "20px", paddingLeft: "8px" }}
      >
        ADMIN PANEL
      </h2>
      <NavLink to="/dashboard" style={linkStyle}>
        Dashboard
      </NavLink>
      <NavLink to="/indent" style={linkStyle}>
        Indent
      </NavLink>
      <NavLink to="/approval" style={linkStyle}>
        Approval
      </NavLink>
      <NavLink to="/settings" style={linkStyle}>
        Settings
      </NavLink>
      <button
        onClick={signOut}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "10px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
