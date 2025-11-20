import React from "react";
import "./AccountLinks.css";

export default function AccountLinks() {
  return (
    <div className="acct">
      <div className="delivery">📅 Your delivery schedule</div>
      <a className="signin" href="#">
        Sign in or create account
      </a>
      <div className="avatar">👤</div>
    </div>
  );
}
