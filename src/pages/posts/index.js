import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import {
  Title,
  Text,
  Center,
  Loader,
  Alert,
  SegmentedControl,
  Flex,
  Paper,
  Button,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

const Posts = () => {
  // category of articles to display: 'all', 'published', 'unpublished'
  const [category, setCategory] = useState("all");

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/admin/posts", fetcher);

  if (error) {
    return (
      <>
        <Title order={2}>Articles</Title>
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
        <Title order={2}>Articles</Title>
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  console.log(data);
  return (
    <>
      <Paper shadow="xs" p="lg" mb={30}>
        <Flex
          justify="space-between"
          align="center"
          direction="row"
          wrap="nowrap"
          // p="md"
        >
          <Title order={2}>Articles</Title>
          <Flex align="center" direction="row" gap="md">
            <SegmentedControl
              value={category}
              onChange={setCategory}
              data={[
                { label: "All", value: "all" },
                { label: "Published", value: "published" },
                { label: "Drafts", value: "unpublished" },
              ]}
            />

            <Link href="/posts/new">
              <Button leftIcon={<IconPencil size="1rem" />} variant="outline">
                New Article
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Paper>

      <Paper shadow="xs" p="lg" mb={30}>
        {data.length < 1 ? (
          <Text>You do not have any articles...</Text>
        ) : (
          <Text>Articles</Text>
        )}
      </Paper>
    </>
  );
};

export default Posts;
