import React from "react";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Center, Alert, Loader } from "@mantine/core";

const SinglePost = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/admin/posts/${router.query.slug}`,
    fetcher
  );

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

  if (!data.post) {
    router.push("/posts");
  }

  console.log(data.post);

  return <div>SinglePost</div>;
};

export default SinglePost;
