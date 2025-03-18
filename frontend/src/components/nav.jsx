import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "rgba(250, 243, 243, 0.9)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.5rem", color: "#2563eb" }}>
        TravelEase
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {[
          { name: "Home", path: "/" },
          { name: "Sign In", path: "/login" },
          { name: "Sign Up", path: "/signup" },
        ].map(({ name, path }) => {
          const navKey = name.toLowerCase().replace(/ /g, "");

          return (
            <Link
              key={name}
              to={path}
              style={{
                textDecoration: "none",
                color: activeNav === navKey ? "#2563eb" : "#555",
                fontWeight: activeNav === navKey ? 600 : 400,
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onClick={() => setActiveNav(navKey)}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
