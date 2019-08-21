import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div>
      <p>Im some other page</p>
      <p>
        <Link className="naked" to="/">
          Go back to home page!
        </Link>
      </p>
    </div>
  );
};
