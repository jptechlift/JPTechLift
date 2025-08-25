import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { blog, BlogPost } from "../services/blog";
import NotFound from "./NotFound";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      blog
        .get(slug)
        .then(setPost)
        .catch(() => {
          setError(true);
        });
    }
  }, [slug]);

  if (error) {
    return <NotFound />;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{post.title}</h1>
      <p>
        {post.author} - {new Date(post.createdDate).toLocaleDateString()} - {post.viewCount} lượt xem
      </p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default BlogDetailPage;