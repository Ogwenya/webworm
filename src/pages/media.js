import { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Loader, Alert, Center, Tabs, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoto, IconVideo, IconTrash } from "@tabler/icons-react";
import { imageFormats, videoFormats } from "@/utils/mediaFormats";
import UploadWidget from "@/components/media/UploadWidget";
import DisplayMedia from "@/components/media/DisplayMedia";
import DeleteMediaModal from "@/components/media/DeleteMediaModal";

const Media = () => {
  // select media for deletion
  const [selectedMedia, setSelectedMedia] = useState(null);

  // deletion modal controls
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/media", fetcher);

  // close modal after deletion
  const handleCloseModal = () => {
    setSelectedMedia(null);
    close();
    mutate("/api/media");
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
            <DisplayMedia
              media={data.resources}
              mediaType={"image"}
              setSelectedMedia={setSelectedMedia}
            />
          ) : (
            <p>No images</p>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="videos" pt="xs">
          {data.resources?.some((resource) =>
            videoFormats.includes(resource.format)
          ) ? (
            <DisplayMedia
              media={data.resources}
              mediaType={"video"}
              setSelectedMedia={setSelectedMedia}
            />
          ) : (
            <p>No videos</p>
          )}
        </Tabs.Panel>
      </Tabs>

      {/*media deletion modal*/}
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

export default Media;
