import React from "react";
import lodash from "lodash";

const Post = ({ title, body }) => {
  return (
    <div className="post">
      <h3>{title}</h3>
      <p>{body}</p>
      <p>likes</p>
    </div>
  );
};

export default Post;
