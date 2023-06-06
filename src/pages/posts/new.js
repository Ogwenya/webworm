import { useState } from "react";
import { useRouter } from "next/router";
import PostEditor from "@/components/posts/PostEditor";

const CreateArticle = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [excerpt, setExcerpt] = useState("");
  const [key_words, setKey_words] = useState("");

  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // save article
  const saveArticle = async () => {
    try {
      setLoading(false);

      if (
        editorContent === "" ||
        title === "" ||
        featureImage === null ||
        excerpt === ""
      ) {
        setAlertMessage({
          type: "error",
          message: "title, body, excerpt and feature image mus be provided.",
        });
      } else {
        const post = new FormData();
        post.append("title", title);
        post.append("body", editorContent);
        post.append("excerpt", excerpt);
        post.append("feature_image", featureImage);
        post.append("key_words", key_words);

        setLoading(true);
        setAlertMessage({
          type: "info",
          message: "saving article",
        });

        const res = await fetch("/api/admin/posts", {
          method: "POST",
          body: post,
        });

        const result = await res.json();

        if (result.success) {
          setLoading(false);
          setAlertMessage({
            type: "success",
            message: result.success,
          });
          router.push(`/posts/${result.slug}`);
        }
        if (result.error) {
          setLoading(false);
          setAlertMessage({
            type: "error",
            message: result.error,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <PostEditor
      data={{
        title,
        setTitle,
        editorContent,
        setEditorContent,
        featureImage,
        setFeatureImage,
        excerpt,
        setExcerpt,
        key_words,
        setKey_words,
      }}
      alertMessage={alertMessage}
      loading={loading}
      saveArticle={saveArticle}
      article_route={"create"}
    />
  );
};

export default CreateArticle;
