import { Paper, Box, SimpleGrid, Image, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { imageFormats, videoFormats } from "@/utils/mediaFormats";

const DisplayMedia = ({
  media,
  mediaType,
  setSelectedMedia,
  selectImage,
  editorModal,
}) => {
  const allowedFormats = mediaType === "image" ? imageFormats : videoFormats;
  return (
    <SimpleGrid
      cols={5}
      spacing="lg"
      breakpoints={[
        { maxWidth: "62rem", cols: 3, spacing: "md" },
        { maxWidth: "48rem", cols: 2, spacing: "sm" },
        { maxWidth: "36rem", cols: 1, spacing: "sm" },
      ]}
    >
      {media.map((resource) => {
        // do not display media format whose format is not in the allowedFormats array
        if (!allowedFormats.includes(resource.format)) {
          return null;
        }

        return (
          <Paper p="sm" shadow="lg" key={resource.public_id}>
            <Box p="xl">
              {mediaType === "image" ? (
                <Image
                  src={resource.secure_url}
                  onClick={() =>
                    editorModal && selectImage(resource.secure_url)
                  }
                />
              ) : (
                <video src={resource.secure_url} width="100%" controls></video>
              )}
            </Box>

            {!editorModal && (
              <ActionIcon
                variant="transparent"
                onClick={() => setSelectedMedia(resource)}
              >
                <IconTrash />
              </ActionIcon>
            )}
          </Paper>
        );
      })}
    </SimpleGrid>
  );
};

export default DisplayMedia;
