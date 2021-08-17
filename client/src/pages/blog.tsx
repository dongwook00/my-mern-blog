import axios from "axios";
import React, {useState, useContext} from "react";
import { useEffect } from "react";
import {Redirect, RouteComponentProps, useHistory, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {Container, Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import UserContext from "../contexts/user";
import IBlog from "../interfaces/blogs";
import IUser from "../interfaces/user";
import IPageProps from "../interfaces/page";
import config from "../config/config";
import LoadingComponent from "../components/LoadingComponent";
import Navigation from "../components/Navigation";
import { Loading } from "../components/LoadingComponent";
import ErrorText from "../components/ErrorText";
import Header from "../components/Header";

const BlogPage: React.FC<IPageProps & RouteComponentProps<any>> = props => {
  const [_id, setId] = useState<string>("");
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [modal, setModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const {user} = useContext(UserContext).userState;
  const history = useHistory();

  useEffect(() => {
    let blogID = props.match.params.blogID;

    if (blogID) {
      setId(blogID);
    } else {
      history.push("/");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (_id !== "") {
      getBlog(_id);
    }
    // eslint-disable-next-line
  }, [_id]);

  const getBlog = async (id: string) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.server.url}/blogs/read/${id}`
      });

      if (response.status === 200 || response.status === 304) {
        setBlog(response.data.blog);
      } else {
        setError(`Unabled to retrieve blog ${_id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  const deleteBlog = async () => {
    setDeleting(true);
    try {
      const response = await axios({
        method: "DELETE",
        url: `${config.server.url}/blogs/${_id}`
      });

      if (response.status === 201) {
        setTimeout(()  => {
          history.push("/");
        }, 1000);
      } else {
        setError(`Unabled to delte blog ${_id}`)
        setDeleting(false);
      }
    } catch (error) {
      setError(error.message);
      setDeleting(false);
    }
  }

  if (loading) return <LoadingComponent>Loading Blog ...</LoadingComponent>;

  if (blog) {
    return (
      <Container fluid className="p-0">
        <Navigation />
        <Modal isOpen={modal}>
          <ModalHeader>
            Delete
          </ModalHeader>
          <ModalBody>
            {deleting ? 
              <Loading />
            :
              "Are you sure you want to delete this blog?"
            }
            <ErrorText error={error} />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => deleteBlog()}>Delete Permanently</Button>
            <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Header
          image={blog.picture || undefined}
          headline={blog.headline}
          title={blog.title}
        >
          <p className="text-white">- 작성자: {(blog.author as IUser).name}<br/> - 작성시간: {new Date(blog.createdAt).toLocaleString()}</p>
        </Header>
        <Container className="mt-5">
          {user._id === (blog.author as IUser)._id &&
            <Container fluid className="p-0">
              <Button color="info" className="mr-2" tag={Link} to={`/edit/${blog._id}`}>
                <i className="fas fa-edit mr-2"></i>Edit
              </Button>
              <Button color="danger" onClick={() => setModal(true)}>
                <i className="far fa-trash-alt mr-2"></i>Delete
              </Button>
              <hr />
            </Container>
          }
          <ErrorText error={error} />
          <div dangerouslySetInnerHTML={{__html: blog.content}}></div>
        </Container>
      </Container>
    );
  } else {
    return <Redirect to="/" />;
  }

}

export default withRouter(BlogPage);