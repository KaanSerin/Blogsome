import React, { useState } from "react";
import { Label, Input, Form, FormGroup, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const NewPost = (props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  let history = useHistory();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.addPost(title, body);
    setTitle("");
    setBody("");
    history.push("/");
  };

  return (
    <div className="new-post">
      <Form onSubmit={onSubmitHandler}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label for="post">Post</Label>
          <Input
            type="textarea"
            id="post"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          ></Input>
        </FormGroup>
        <Button color="danger">Submit</Button>
      </Form>
    </div>
  );
};

export default NewPost;
