import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div>
      <p>Im some other page at v2</p>
      <p>
        <Link className="naked" to="/">
          Go back to home page!
        </Link>
      </p>
    </div>
  );
};
