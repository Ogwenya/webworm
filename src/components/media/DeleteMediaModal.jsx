import { useState } from "react";
import { Button, Alert, Text } from "@mantine/core";

const DeleteMediaModal = ({ media, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const publicId = media.public_id.split("/")[1];

    setLoading(true);
    setAlertMessage({ type: "info", message: "Deleting..." });
    const res = await fetch(
      `/api/media/${publicId}?resource_type=${media.resource_type}`,
      {
        method: "DELETE",
      }
    );

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
      <Text> Are you sure you want to delete the selected media?</Text>

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

export default DeleteMediaModal;
