import React from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const Post = ({ id, title, body, deletePostHandler }) => {
  const history = useHistory();

  return (
    <div className="post">
      <h3>{title}</h3>
      <p>{body.slice(0, 40) + "..."}</p>
      <p>likes</p>
      <Button
        onClick={() => {
          history.push(`/my-posts/post?id=${id}`);
        }}
        color="info"
      >
        View Post
      </Button>

      <Button onClick={deletePostHandler} outline color="danger">
        Delete Post
      </Button>
    </div>
  );
};

export default Post;
