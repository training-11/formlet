import React from "react";
import "./AccountLinks.css";
import { Link } from "react-router-dom";

export default function AccountLinks() {
  return (
    <div className="acct">
      <div className="delivery">📅 Your delivery schedule</div>
      {/* <a className="signin" href="#">
        Sign in or create account
      </a> */}
      <Link className="signin" to="/login">
  Sign in or create account
</Link>

      <div className="avatar">👤</div>
    </div>
  );
}
