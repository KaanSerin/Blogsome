import React from "react";
import Post from "./Post/Post";
import { Spinner } from "reactstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const Posts = ({ posts, isLoading, deletePost }) => {
  const postList = (
    <TransitionGroup>
      {posts.map((post) => (
        <CSSTransition
          key={post.id}
          timeout={300}
          classNames="postItem"
          unmountOnExit={true}
          appear={true}
        >
          <Post
            id={post.id}
            title={post.title}
            body={post.body}
            deletePostHandler={() => deletePost(post.id)}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );

  let output = posts.length > 0 ? postList : <h3>You have no posts :(</h3>;

  if (isLoading) {
    output = <Spinner color="primary" />;
  }

  return <div className="posts">{output}</div>;
};

export default Posts;
