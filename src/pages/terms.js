import { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Title, Flex, Button, Center, Loader, Alert } from "@mantine/core";
import TextEditor from "@/components/editor/TextEditor";

const Terms = () => {
  const [editorContent, setEditorContent] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/admin/terms", fetcher);

  useEffect(() => {
    if (data) {
      setEditorContent(data.content);
    }
  }, [data]);

  const saveData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/terms", {
        method: "PATCH",
        body: JSON.stringify(editorContent),
      });
      const result = await res.json();

      if (result.success) {
        setLoading(false);
        setAlertMessage({
          type: "success",
          message: result.success,
        });
        mutate();
      }
      if (result.error) {
        setLoading(false);
        setAlertMessage({
          type: "error",
          message: result.error,
        });
      }
    } catch (error) {
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
        <Title order={2}>Terms & Conditions</Title>
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
        <Title order={2}>Terms & Conditions</Title>
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

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
        >
          {alertMessage.message}
        </Alert>
      )}
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
        p="md"
      >
        <Title order={2}>Terms & Conditions</Title>
        <Button loading={loading} onClick={saveData}>
          Save
        </Button>
      </Flex>
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
    </>
  );
};

export default Terms;
