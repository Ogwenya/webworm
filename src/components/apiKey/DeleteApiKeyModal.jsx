import { useState } from "react";
import { Button, Alert, Text } from "@mantine/core";

const DeleteApiKeyModal = ({ apiKey, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAlertMessage({ type: "info", message: "Deleting..." });
    const res = await fetch(`/api/admin/apiKey/${apiKey._id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (result.success) {
      setLoading(false);
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
          color={alertMessage.type === "info" ? "cyan" : "red"}
          radius="md"
          mb={10}
        >
          {alertMessage.message}
        </Alert>
      )}
      <Text>
        Are you sure you want to delete API Key for: "{apiKey.name}" ?
      </Text>
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

export default DeleteApiKeyModal;
