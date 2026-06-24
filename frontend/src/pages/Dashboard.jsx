import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase.from("indents").select("status");
    if (!error && data) {
      setStats({
        total: data.length,
        pending: data.filter((i) => i.status === "pending").length,  
        approved: data.filter((i) => i.status === "approved").length,
        rejected: data.filter((i) => i.status === "rejected").length,
      });
    }
  };

  const cardStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    flex: 1,
  };

  return (
    /**simple laout internal css  */
    <Layout> 
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Indents</h3>
          <p style={{ fontSize: "28px" }}>{stats.total}</p>
        </div>
        <div style={cardStyle}>
          <h3>Pending</h3>
          <p style={{ fontSize: "28px", color: "#f59e0b" }}>{stats.pending}</p>
        </div>
        <div style={cardStyle}>
          <h3>Approved</h3>
          <p style={{ fontSize: "28px", color: "#16a34a" }}>{stats.approved}</p>
        </div>
        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p style={{ fontSize: "28px", color: "#dc2626" }}>{stats.rejected}</p>
        </div>
      </div>
    </Layout>
  );
}
