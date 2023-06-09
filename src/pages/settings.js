import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useMediaQuery, useClipboard, useDisclosure } from "@mantine/hooks";
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  List,
  ActionIcon,
  useMantineTheme,
  rem,
  Tooltip,
  Box,
  Center,
  Loader,
  Alert,
  Code,
  Table,
  Modal,
} from "@mantine/core";
import { IconCopy, IconCheck, IconTrash } from "@tabler/icons-react";
import DeleteApiKeyModal from "@/components/apiKey/DeleteApiKeyModal";

const Settings = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const isTablet = useMediaQuery("(max-width: 63em)");
  const clipboard = useClipboard({ timeout: 500 });

  const [host, setHost] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [hostError, setHostError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/admin/apiKey", fetcher);

  // generate api key
  const generateKey = async () => {
    try {
      setHostError("");
      setAlertMessage("");

      if (!host) {
        setHostError("API key must be associated with a host");
      } else {
        setLoading(true);
        const res = await fetch("/api/admin/apiKey", {
          method: "POST",
          body: JSON.stringify({ host }),
        });

        const result = await res.json();

        if (result.sucess) {
          setLoading(false);
          setHost("");
          setApiKey(result.apiKey);
          mutate("/api/admin/apiKey");
        }

        if (result.error) {
          setLoading(false);
          setAlertMessage(result.error);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlertMessage(error.message);
    }
  };

  // close modal after deletion
  const handleCloseModal = () => {
    setSelectedKey(null);
    mutate("/api/admin/apiKey");
    close();
  };

  if (error) {
    return (
      <>
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
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Paper p="md">
        <Title order={4} mb="md">
          Generate API Key
        </Title>

        {/* info */}
        <List size="sm" mb="lg" withPadding>
          <List.Item>
            Enter the host domain for the blog frontend that will make API calls
            to this backend.
          </List.Item>
          <List.Item>
            The API Key will only work for the specific domain provided to
            ensure if leaked, cannot be used to access the server.
          </List.Item>
          <List.Item>
            The host must start with either <Code>http://</Code> or
            <Code>https://</Code>
          </List.Item>
        </List>

        {/* alert message */}
        {alertMessage && (
          <Alert
            color={"red"}
            radius="md"
            mb="md"
            w={isTablet ? "100%" : "50%"}
          >
            {alertMessage}
          </Alert>
        )}
        <TextInput
          placeholder="https://example.com"
          label="Host"
          radius="md"
          mb="xl"
          value={host}
          onChange={(event) => setHost(event.currentTarget.value)}
          required
          rightSection={
            <Button radius="md" loading={loading} onClick={generateKey}>
              Generate Key
            </Button>
          }
          rightSectionWidth="auto"
          w={isTablet ? "100%" : "50%"}
          error={hostError}
        />

        {/* DISPLAY GENERATED API KEY */}

        {apiKey && (
          <Box mb="xl">
            <Text fz="sm" c="gray" mb="sm">
              Please copy this key and keep it safe as it will not be displayed
              again
            </Text>
            <Tooltip
              label="Key copied!"
              offset={5}
              position="bottom"
              radius="xl"
              transitionProps={{ duration: 100, transition: "slide-down" }}
              opened={clipboard.copied}
            >
              <Button
                variant="light"
                rightIcon={
                  clipboard.copied ? (
                    <IconCheck size="1.2rem" stroke={1.5} />
                  ) : (
                    <IconCopy size="1.2rem" stroke={1.5} />
                  )
                }
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: rem(14), height: rem(48) },
                  rightIcon: { marginLeft: rem(22) },
                }}
                onClick={() => clipboard.copy(apiKey)}
              >
                {apiKey}
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* display available api keys */}

        <Box mb="xl">
          {data.length > 0 ? (
            <>
              <Table
                w="auto"
                horizontalSpacing="xl"
                verticalSpacing="xs"
                withBorder
              >
                <thead>
                  <tr>
                    <th>Host</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((key) => (
                    <tr key={key._id}>
                      <td>{key.host}</td>
                      <td>
                        <ActionIcon onClick={() => setSelectedKey(key)}>
                          <IconTrash size="1.3rem" />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* delete api key modal */}
              {selectedKey && (
                <Modal opened onClose={handleCloseModal} title="Delete API Key">
                  <DeleteApiKeyModal
                    apiKey={selectedKey}
                    closeModal={handleCloseModal}
                  />
                </Modal>
              )}
            </>
          ) : (
            <Text c="red" fz="sm">
              No API Keys generated.
            </Text>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Settings;

{
  /* <ActionIcon
              size={32}
              radius="md"
              variant="filled"
              color={theme.primaryColor}
            >
              <IconArrowRight size="1.1rem" stroke={1.5} />
            </ActionIcon> */
}
