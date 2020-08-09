import React from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import Post from "../Post/Post";

const FullPost = React.memo(({ posts }) => {
  const history = useHistory();
  const postId = history.location.search.split("=")[1];

  let fullPost = <Spinner color="danger" />;

  if (posts.length > 0) {
    fullPost = posts.find((post) => post.id === postId);
    fullPost = (
      <div className="full-post">
        <h2>{fullPost.title}</h2>
        <div>
          {fullPost.body.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    );
  }

  return fullPost;
});

export default FullPost;
