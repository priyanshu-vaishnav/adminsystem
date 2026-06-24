import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f4f5f9",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
