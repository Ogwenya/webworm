import { useState } from "react";
import { Button, Alert, Text } from "@mantine/core";

const DeletePostModal = ({ post, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAlertMessage({ type: "info", message: "Deleting..." });
    const res = await fetch(`/api/admin/posts/${post.slug}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (result.success) {
      setLoading(false);
      setAlertMessage({ type: "success", message: result.success });
      closeModal();
    }
    if (result.error) {
      setLoading(false);
      setAlertMessage({ type: "error", message: result.error });
    }
  };

  return (
    <div>
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
          mb={10}
        >
          {alertMessage.message}
        </Alert>
      )}
      <Text> Are you sure you want to delete Article: "{post.title}" ?</Text>

      <Button
        type="submit"
        radius="md"
        color="red"
        uppercase
        mt={15}
        loading={loading}
        onClick={handleSubmit}
      >
        Delete
      </Button>
    </div>
  );
};

export default DeletePostModal;
