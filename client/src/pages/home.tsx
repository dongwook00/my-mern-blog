import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import IPageProps from "../interfaces/page";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import IBlog from "../interfaces/blogs";
import IUser from "../interfaces/user";
import axios from "axios";
import config from "../config/config";
import logging from "../config/logging";
import LoadingComponent from "../components/LoadingComponent";
import BlogPreview from "../components/BlogPreview";
import ErrorText from "../components/ErrorText";

const HomePage: React.FC<IPageProps> = props => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    GetAllBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetAllBlogs = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.server.url}/blogs`
      });

      if (response.status === 200 || response.status === 304) {
        let blogs = response.data.blogs as IBlog[];
        blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
        setBlogs(blogs);
      } 
    } catch (error) {
      logging.error(error);
      setError("Unabled to retreive blogs");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    if (loading) {
      return <LoadingComponent>Loading blogs ...</LoadingComponent>
    }
  };

  return (
    <Container fluid className="p-0">
      <Navigation />
      <Header
        title="안녕하세요, MERN블로그 입니다."
        headline="글을 올려보세요!"
      />
      <Container className="mt-5">
        {blogs.length === 0 && <p>아직 게시글이 없습니다. 최초로 <Link to="/edit">작성</Link> 해보세요! 😀</p>}
        {blogs.map((blog, index) => {
          return (
            <>
              <div key={index}>
                <BlogPreview
                  _id={blog._id}
                  author={(blog.author as IUser).name}
                  headline={blog.headline}
                  title={blog.title}
                  createdAt={blog.createdAt}
                  updatedAt={blog.updatedAt}
                />
              </div>
              <hr />
            </>
          );
        })}
        <ErrorText error={error} />
      </Container>
    </Container>
  );
}

export default HomePage;