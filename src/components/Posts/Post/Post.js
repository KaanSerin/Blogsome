import React from "react";
import { Button } from "reactstrap";

const Post = ({ title, body, deletePostHandler }) => {
  return (
    <div className="post">
      <h3>{title}</h3>
      <p>{body}</p>
      <p>likes</p>
      <Button onClick={deletePostHandler} outline color="danger">
        Delete Post
      </Button>
    </div>
  );
};

export default Post;
