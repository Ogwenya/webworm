import { useState } from "react";
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
  ActionIcon,
  Table,
  TextInput,
  Group,
} from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconSearch,
  IconPlus,
  IconArticleOff,
} from "@tabler/icons-react";

const Posts = () => {
  // category of articles to display: 'all', 'published', 'unpublished'
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/admin/posts?page=${page}&filter=${category}&search=${search}&delay=1`,
    fetcher
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const header = (
    <Paper shadow="xs" p="lg" mb="md">
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
      >
        <Title order={2}>Articles</Title>
        <Link href="/posts/new">
          <Button leftIcon={<IconPlus size="1.2rem" />} variant="outline">
            New Article
          </Button>
        </Link>
      </Flex>
    </Paper>
  );

  if (error) {
    return (
      <>
        {header}
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
        {header}
        <Center>
          <Loader variant="bars" />
        </Center>
      </>
    );
  }

  return (
    <>
      {header}
      <Paper shadow="xs" p="lg" mb={30}>
        {/* search and filter */}
        <Flex align="center" direction="row" justify="space-between" mb="lg">
          {/* search bar */}
          <form onSubmit={handleSearch}>
            <Flex align="center" direction="row" wrap="nowrap">
              <TextInput
                placeholder="Search by any field"
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={searchInput}
                onChange={(event) => setSearchInput(event.currentTarget.value)}
              />
              <Button type="submit">Search</Button>
            </Flex>
          </form>

          {/* filters */}
          <SegmentedControl
            value={category}
            onChange={setCategory}
            data={[
              { label: "All", value: "all" },
              { label: "Published", value: "published" },
              { label: "Drafts", value: "unpublished" },
            ]}
          />
        </Flex>

        {data.posts.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Publish Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.isPublished ? "Published" : "Draft"}</td>
                  <td>
                    <Flex>
                      <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
                        <ActionIcon>
                          <IconPencil size="1.3rem" color="blue" />
                        </ActionIcon>
                      </Link>
                      <ActionIcon>
                        <IconTrash size="1.3rem" color="red" />
                      </ActionIcon>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Group p="md">
            <IconArticleOff color="gray" />
            <Text c="gray">No Articles to display.</Text>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Posts;
