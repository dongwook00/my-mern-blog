import React, {useContext, useEffect, useState} from "react";
import IPageProps from "../interfaces/page";
import {EditorState, ContentState, convertToRaw} from "draft-js";
import UserContext from "../contexts/user";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import logging from "../config/logging";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import LoadingComponent from "../components/LoadingComponent";
import { Container, FormGroup, Form, Label, Input, Button } from "reactstrap";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ErrorText from "../components/ErrorText";
import SuccessText from "../components/SuccessText";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const EditPage: React.FC<IPageProps & RouteComponentProps<any>> = props => {
  const [_id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {user} = useContext(UserContext).userState;

  useEffect(() => {
    let blogID = props.match.params.blogID;
    if (blogID) {
      setId(blogID);
      getBlog(blogID);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const getBlog = async (id: string) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.server.url}/blogs/read/${id}`
      });

      if (response.status === 200 || response.status === 304) {
        if (user._id !== response.data.blog.author._id) {
          logging.warn("This blog is owned by someone else");
          setId("");
        } else {
          console.log("response", response);
          setTitle(response.data.blog.title);
          setContent(response.data.blog.content);
          setHeadline(response.data.blog.headline);
          setPicture(response.data.blog.picture || "");

          /** Convert html string to draft JS editor state */
          const contentBlock = htmlToDraft(response.data.blog.content);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const _editorState = EditorState.createWithContent(contentState);
          setEditorState(_editorState);
        }
      } else {
        setError(`Unabled to retrieve blog ${_id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const createBlog = async () => {
    if (title === "" || headline === "" || content === "") {
      setError("Please fill out all required forms.");
      setSuccess("");
      return null;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    
    try {
      const response = await axios({
        method: "POST",
        url: `${config.server.url}/blogs/create`,
        data: {
          title,
          picture,
          headline,
          content,
          author: user._id
        }
      });
      if (response.status === 201) {
        setId(response.data.blog._id);
        setSuccess("Blog posted, You can continue to edit it on this page.");
      } else {
        setError("Unable to sava blog.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }
  const editBlog = async () => {
    if (title === "" || headline === "" || content === "") {
      setError("Please fill out all required forms.");
      setSuccess("");
      return null;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    
    try {
      const response = await axios({
        method: "PATCH",
        url: `${config.server.url}/blogs/update/${_id}`,
        data: {
          title,
          picture,
          headline,
          content,
        }
      });
      if (response.status === 201) {
        setSuccess("Blog updated");
      } else {
        setError("Unable to sava blog.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingComponent />;

  return (
    <Container fluid className="p-0">
      <Navigation />
      <Header
        headline=""
        title={_id !== "" ? "Edit your blog" : "Create a blog"}
      />
      <Container className="mt-5 mb-5">
        <ErrorText error={error} />
        <Form>
          <FormGroup>
            <Label for="title">Title *</Label>
            <Input
              type="text"
              name="title"
              value={title}
              id="title"
              placeholder="Enter a title"
              disabled={saving}
              onChange={event => setTitle(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="pciture">Picture URL</Label>
            <Input
              type="text"
              name="picture"
              value={picture}
              id="picture"
              placeholder="Picture URL, ex: http://...."
              disabled={saving}
              onChange={event => setPicture(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="headline">Headline</Label>
            <Input
              type="text"
              name="headline"
              value={headline}
              id="headline"
              placeholder="Enter a headline ..."
              disabled={saving}
              onChange={event => setHeadline(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Content</Label>
            <Editor
              editorState={editorState}
              wrapperClassName="card"
              editorClassName="card-body"
              onEditorStateChange={newState => {
                setEditorState(newState);
                setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
              }}
              toolbar={{
                options: ["inline", "blockType", "fontSize", "list", "textAlign", "history", "embedded", "emoji", "image"],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true }
              }}
            />
          </FormGroup>
          <FormGroup>
            <SuccessText success={success} />
          </FormGroup>
          <FormGroup>
            <Button
              block
              onClick={() => {
                if (_id !== "") {
                  editBlog();
                } else {
                  createBlog();
                }
              }}
              disabled={saving}
            >
              <i className="fas fa-save mr-1"></i>
              {_id !== "" ? "Update" : "Post"}
            </Button>
            {_id !== "" &&
              <Button
                block
                color="success"
                tag={Link}
                to={`/blogs/${_id}`}
              >
                View your blog post!
              </Button>
            }
          </FormGroup>
          <FormGroup>
            <Label>Preview</Label>
            <div className="border p-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: content
                }}
              />
            </div>
          </FormGroup>
        </Form>
        <ErrorText error={error} />
      </Container>

    </Container>
  )
}

export default withRouter(EditPage);