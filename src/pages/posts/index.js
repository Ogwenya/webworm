import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { useDisclosure } from "@mantine/hooks";
import {
  useMantineTheme,
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
  Modal,
} from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconSearch,
  IconPlus,
  IconArticleOff,
  IconSquareRoundedChevronLeft,
  IconSquareRoundedChevronRight,
  IconArrowRight,
} from "@tabler/icons-react";
import DeletePostModal from "@/components/posts/DeletePostModal";

const Posts = () => {
  const theme = useMantineTheme();
  // deletion modal controls
  const [opened, { open, close }] = useDisclosure(false);

  // select post for deletion
  const [selectedPost, setSelectedPost] = useState(null);

  // category of articles to display: 'all', 'published', 'unpublished'
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/admin/posts?page=${page}&filter=${category}&search=${search}&delay=1`,
    fetcher
  );

  // search for post
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  // close modal after deletion
  const handleCloseModal = () => {
    setSelectedPost(null);
    mutate(
      `/api/admin/posts?page=${page}&filter=${category}&search=${search}&delay=1`
    );
    close();
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
          <TextInput
            radius="xl"
            size="md"
            placeholder="Search by any field"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={searchInput}
            onChange={(event) => setSearchInput(event.currentTarget.value)}
            rightSection={
              <ActionIcon
                size={32}
                radius="xl"
                variant="filled"
                color={theme.primaryColor}
                onClick={handleSearch}
              >
                <IconArrowRight size="1.1rem" stroke={1.5} />
              </ActionIcon>
            }
          />

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
          <>
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
                        <ActionIcon onClick={() => setSelectedPost(post)}>
                          <IconTrash size="1.3rem" color="red" />
                        </ActionIcon>
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* pagination */}
            <Group position="apart" p="lg" m={20}>
              <Text c="gray" fz="sm">
                Showing {data.startIndex + 1}-
                {data.total_posts >= data.startIndex + data.per_page
                  ? data.startIndex + data.per_page
                  : data.total_posts}{" "}
                of {data.total_posts}
              </Text>
              <Group position="right">
                {/* previous page button */}
                <ActionIcon
                  variant="transparent"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <IconSquareRoundedChevronLeft />
                </ActionIcon>
                <Text c="gray" fz="sm">
                  Page {page}
                </Text>

                {/* next page button */}
                <ActionIcon
                  variant="transparent"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <IconSquareRoundedChevronRight />
                </ActionIcon>
              </Group>
            </Group>
          </>
        ) : (
          <Group p="md">
            <IconArticleOff color="gray" />
            <Text c="gray">No Articles to display.</Text>
          </Group>
        )}
      </Paper>

      {/* deletion modal */}
      {selectedPost && (
        <Modal opened onClose={handleCloseModal} title="Delete Article">
          <DeletePostModal post={selectedPost} closeModal={handleCloseModal} />
        </Modal>
      )}
    </>
  );
};

export default Posts;
