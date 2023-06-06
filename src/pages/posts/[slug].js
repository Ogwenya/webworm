import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import PostEditor from "@/components/posts/PostEditor";
import { Center, Alert, Loader } from "@mantine/core";

const SinglePost = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [currentFeatureImage, setCurrentFeatureImage] = useState(null);
  const [excerpt, setExcerpt] = useState("");
  const [key_words, setKey_words] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/admin/posts/${router.query.slug}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setTitle(data.post.title);
      setEditorContent(data.post.body);
      setExcerpt(data.post.excerpt);
      setKey_words(data.post.key_words);
      setIsPublished(data.post.isPublished);
      setCurrentFeatureImage(data.post.feature_image.url);
      // setTitle(data.title)
    }
  }, [data]);

  // save article
  const saveArticle = async () => {
    try {
      setLoading(false);

      if (editorContent === "" || title === "" || excerpt === "") {
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

        const res = await fetch(
          `/api/admin/posts/${router.query.slug}?update=content`,
          {
            method: "PATCH",
            body: post,
          }
        );

        const result = await res.json();

        if (result.success) {
          setLoading(false);
          setAlertMessage({
            type: "success",
            message: result.success,
          });

          // updates url incase title was changed
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

  // publish Article
  const handlePublish = async () => {
    try {
      setLoading(true);
      setAlertMessage({
        type: "info",
        message: isPublished ? "Saving to Draft." : "Publishing Article.",
      });

      const form = new FormData();
      form.append("isPublished", !isPublished);

      const res = await fetch(
        `/api/admin/posts/${router.query.slug}?update=publish`,
        {
          method: "PATCH",
          body: form,
        }
      );

      const result = await res.json();

      if (result.success) {
        setLoading(false);
        setAlertMessage({
          type: "success",
          message: result.success,
        });

        mutate(`/api/admin/posts/${router.query.slug}`);
      }
      if (result.error) {
        setLoading(false);
        setAlertMessage({
          type: "error",
          message: result.error,
        });
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

  if (error) {
    return (
      <>
        <Center>
          <Alert title="ERROR!" color="red" radius="md" variant="filled">
            {error.message}
          </Alert>
        </Center>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  if (!data.post) {
    router.push("/posts");
  }

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
        isPublished,
        currentFeatureImage,
      }}
      alertMessage={alertMessage}
      loading={loading}
      saveArticle={saveArticle}
      handlePublish={handlePublish}
      article_route={"edit"}
    />
  );
};

export default SinglePost;
