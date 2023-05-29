import {
  useMantineTheme,
  UnstyledButton,
  Group,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import { IconCloudUpload } from "@tabler/icons-react";

const UploadWidget = ({ revalidateData }) => {
  const theme = useMantineTheme();

  async function uploadToCloudinary() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          revalidateData();
          widget.close({
            quiet: true,
          });
        } else if (error) {
          console.log(error);
        }
      }
    );

    widget.open();
  }

  return (
    <UnstyledButton onClick={uploadToCloudinary} mb="lg">
      <Paper p="md" shadow="xs" w={300} radius="md" withBorder>
        <Group position="center">
          <IconCloudUpload
            size={rem(50)}
            color={
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
            }
            stroke={1.5}
          />

          <Text ta="center" mt="xs" c="dimmed">
            Click to upload Media.
          </Text>
        </Group>
      </Paper>
    </UnstyledButton>
  );
};

export default UploadWidget;
