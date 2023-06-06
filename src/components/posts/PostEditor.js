import { useState, useEffect } from "react";
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

const PostEditor = ({
  data,
  alertMessage,
  loading,
  saveArticle,
  handlePublish,
  article_route,
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  // feature image preview
  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    if (data.featureImage) {
      reader.readAsDataURL(data.featureImage);
    }
  }, [data.featureImage]);

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
            value={data.title}
            onChange={(event) => data.setTitle(event.currentTarget.value)}
          />
        </Grid.Col>

        {/* Action buttons: Save OR Draft */}
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

            {article_route === "edit" && (
              <Button
                radius="md"
                variant="outline"
                color={data.isPublished ? "blue" : "green"}
                uppercase
                loading={loading}
                onClick={handlePublish}
              >
                {data.isPublished ? " Move to Draft" : "Publish"}
              </Button>
            )}
          </Group>
        </Grid.Col>

        {/* EDITOR */}
        <Grid.Col span={9}>
          <Paper shadow="sm" p="md">
            <TextEditor
              editorContent={data.editorContent}
              setEditorContent={data.setEditorContent}
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
                value={data.excerpt}
                onChange={(event) => data.setExcerpt(event.currentTarget.value)}
              />

              {/* Feature Image */}
              {article_route === "create" ? (
                data.featureImage && <Image src={previewImage} alt="Preview" />
              ) : (
                <Image
                  src={
                    data.featureImage ? previewImage : data.currentFeatureImage
                  }
                  alt="Preview"
                />
              )}

              <FileInput
                label="Feature Image"
                placeholder="Select Image"
                value={data.featureImage}
                onChange={data.setFeatureImage}
                withAsterisk
              />

              {/* Key words */}
              <Textarea
                placeholder="Key words seperated by a comma"
                label="Key words"
                autosize
                minRows={2}
                value={data.key_words}
                onChange={(event) =>
                  data.setKey_words(event.currentTarget.value)
                }
              />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default PostEditor;
