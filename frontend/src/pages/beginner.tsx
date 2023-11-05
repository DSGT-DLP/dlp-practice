import React, { type ReactNode, useState } from "react";
import Image from "next/image";
import NavbarMain from "@/common/components/NavBarMain";
import Footer from "@/common/components/Footer";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  btn: {
    appearance: "button",
    backgroundColor: "#000",
    border: "1px solid #000",
    borderRadius: "4px",
    boxShadow: "4px 4px 0 0 rgba(255, 255, 255, 1), 4px 4px 0 1px #000",
    boxSizing: "border-box",
    color: "#fff",
    cursor: "pointer",
    display: "inline-block",
    fontFamily: "ITCAvantGardeStd-Bk, Arial, sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "20px",
    padding: "12px 40px",
    textAlign: "center",
    textTransform: "none",
    touchAction: "manipulation",
    userSelect: "none",
    WebkitUserSelect: "none",
    whiteSpace: "nowrap",
  },
  msg: {
    marginTop: "20px",
    fontFamily: "Pacifico, cursive",
    fontSize: "24px",
  },
};

const Beginner = () => {
  const [responseText, setResponseText] = useState("");

  const handleClick = () => {
    fetch("http://localhost:8000/api/super_cool_awesome_endpoint")
      .then((response) => response.json())
      .then((data) => {
        setResponseText(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <button style={styles.btn as React.CSSProperties} onClick={handleClick}>
        Click me bro
      </button>
      {responseText && <h3 style={styles.msg}>{responseText}</h3>}
    </div>
  );
};

export default Beginner;
