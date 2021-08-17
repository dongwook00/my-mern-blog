import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";

export interface IBlogPreviewProps {
  _id: string;
  title: string;
  headline: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

const BlogPreview: React.FC<IBlogPreviewProps> = props => {
  const { _id, author, children, createdAt, updatedAt, title } = props;
  return (
    <Card className="border-0">
      <CardBody className="p-0">
        <Link
          to={`/blogs/${_id}`}
          style={{ textDecoration: "none" }}
          className="text-primary"
        >
          <h1><strong>{title}</strong></h1>
          {/* <h3>{headline}</h3> */}
        </Link>
        {createdAt !== updatedAt ? 
          <p className="text-secondary"><i><b>{author}</b>님에 의해  <b>{new Date(updatedAt).toLocaleString()}</b> 에 수정됨</i></p>
        :
          <p className="text-secondary"><i><b>{author}</b>님에 의해  <b>{new Date(createdAt).toLocaleString()}</b>에 작성됨</i></p>
        }
        {children}
      </CardBody>
    </Card>
  )
}

export default BlogPreview;
