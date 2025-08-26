import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { blog, BlogPost } from "../services/blog";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(false);
      blog
        .get(slug)
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading post.</div>;
  }

  if (post) {
    return (
      <div style={{ padding: 16 }}>
        <h1>{post.title}</h1>
        <p>
          {post.author} - {new Date(post.createdDate).toLocaleDateString()} - {post.viewCount} lượt xem
        </p>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    );
  }

  return null;
};

export default BlogDetailPage;