import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Stack,
  Group,
  Paper,
  TextInput,
  FileInput,
  Button,
  Textarea,
  Image,
  Alert,
} from "@mantine/core";
import TextEditor from "@/components/editor/TextEditor";

const CreateArticle = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [excerpt, setExcerpt] = useState("");
  const [key_words, setKey_words] = useState("");

  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // feature image preview
  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    if (featureImage) {
      reader.readAsDataURL(featureImage);
    }
  }, [featureImage]);

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
    <>
      {alertMessage && (
        <Alert
          color={
            alertMessage.type === "info"
              ? "cyan"
              : alertMessage.type === "error"
              ? "red"
              : "green"
          }
          radius="md"
          m="md"
        >
          {alertMessage.message}
        </Alert>
      )}

      <Grid>
        {/* Article title */}
        <Grid.Col span={9}>
          <TextInput
            placeholder="Article title..."
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </Grid.Col>

        {/* Action buttons: Save */}
        <Grid.Col span={3}>
          <Group position="right">
            <Button
              color="green"
              radius="md"
              uppercase
              loading={loading}
              onClick={saveArticle}
            >
              Save
            </Button>
          </Group>
        </Grid.Col>

        {/* EDITOR */}
        <Grid.Col span={9}>
          <Paper shadow="sm" p="md">
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </Paper>
        </Grid.Col>

        {/* OTHER DETAILS: Excerpt, Feature Image, Key words */}
        <Grid.Col span={3} shadow="md">
          <Paper shadow="sm" p="md">
            <Stack>
              {/* Excerpt */}
              <Textarea
                placeholder="Article Excerpt"
                label="Excerpt"
                autosize
                minRows={2}
                withAsterisk
                value={excerpt}
                onChange={(event) => setExcerpt(event.currentTarget.value)}
              />

              {/* Feature Image */}
              {featureImage && <Image src={previewImage} alt="Preview" />}
              <FileInput
                label="Feature Image"
                placeholder="Select Image"
                value={featureImage}
                onChange={setFeatureImage}
                withAsterisk
              />

              {/* Key words */}
              <Textarea
                placeholder="Key words seperated by a comma"
                label="Key words"
                autosize
                minRows={2}
                value={key_words}
                onChange={(event) => setKey_words(event.currentTarget.value)}
              />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default CreateArticle;
