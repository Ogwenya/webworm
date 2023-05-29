import { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  Tabs,
  SimpleGrid,
  Image,
  Loader,
  Alert,
  Center,
  Paper,
  Box,
  ActionIcon,
  Text,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoto, IconVideo, IconTrash } from "@tabler/icons-react";
import UploadWidget from "./UploadWidget";
import DeleteMediaModal from "./DeleteMediaModal";

const MediaManager = () => {
  const imageFormats = ["png", "jpg", "gif", "jpeg", "svg+xml", "webp", "avif"];
  const videoFormats = ["mp4", "mp3"];
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/media", fetcher);

  const handleCloseModal = () => {
    setSelectedMedia(null);
    close();
    mutate("/api/media");
  };

  const displayMedia = (mediaType) => {
    const resourceFormats = mediaType === "image" ? imageFormats : videoFormats;

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
        {data.resources.map((resource) => {
          if (!resourceFormats.includes(resource.format)) {
            return null;
          }

          return (
            <Paper p="sm" shadow="lg" key={resource.public_id}>
              <Box p="xl">
                {mediaType === "image" ? (
                  <Image src={resource.secure_url} />
                ) : (
                  <video
                    src={resource.secure_url}
                    width="100%"
                    controls
                  ></video>
                )}
              </Box>
              <ActionIcon
                variant="transparent"
                onClick={() => setSelectedMedia(resource)}
              >
                <IconTrash />
              </ActionIcon>
            </Paper>
          );
        })}
      </SimpleGrid>
    );
  };

  if (error) {
    return (
      <>
        <UploadWidget revalidateData={mutate} />
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
        <UploadWidget revalidateData={mutate} />
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  return (
    <>
      <UploadWidget revalidateData={mutate} />
      <Tabs defaultValue="images">
        <Tabs.List>
          <Tabs.Tab value="images" icon={<IconPhoto size="0.8rem" />}>
            Images
          </Tabs.Tab>
          <Tabs.Tab value="videos" icon={<IconVideo size="0.8rem" />}>
            Videos
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="images" pt="xs">
          {data.resources?.some((resource) =>
            imageFormats.includes(resource.format)
          ) ? (
            <>{displayMedia("image")}</>
          ) : (
            <p>No images</p>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="videos" pt="xs">
          {data.resources?.some((resource) =>
            videoFormats.includes(resource.format)
          ) ? (
            <>{displayMedia("video")}</>
          ) : (
            <p>No videos</p>
          )}
        </Tabs.Panel>
      </Tabs>

      {selectedMedia && (
        <Modal opened onClose={handleCloseModal} title="Delete Asset">
          <DeleteMediaModal
            media={selectedMedia}
            closeModal={handleCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

export default MediaManager;
