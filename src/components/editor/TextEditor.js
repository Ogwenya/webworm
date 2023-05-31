import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import useSWR, { useSWRConfig } from "swr";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Loader, Center, Alert } from "@mantine/core";
import DisplayMedia from "@/components/media/DisplayMedia";
import UploadWidget from "@/components/media/UploadWidget";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const { default: BlotFormatter } = await import("quill-blot-formatter");
    RQ.Quill.register("modules/blotFormatter", BlotFormatter);

    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

const TextEditor = ({ editorContent, setEditorContent }) => {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/media", fetcher);

  const quillRef = useRef(null);
  const [opened, { open, close }] = useDisclosure(false);

  const selectImage = (imageUrl) => {
    let quillObj = quillRef.current.getEditor();
    const range = quillObj.getSelection();
    quillObj.editor.insertEmbed(range.index, "image", imageUrl);
    close();
  };

  const imageHandler = async () => {
    open();
  };

  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          [{ color: [] }, { background: [] }, { align: [] }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      blotFormatter: {},
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
    }),
    []
  );

  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <>
      <ReactQuill
        forwardedRef={quillRef}
        modules={modules}
        formats={formats}
        value={editorContent}
        onChange={setEditorContent}
      />
      <Modal
        opened={opened}
        onClose={close}
        size={{ base: "100%", sm: "lg" }}
        title="Add New Product"
      >
        {!data ? (
          <Center>
            <Loader variant="bars" />
          </Center>
        ) : error ? (
          <Center>
            <Alert title="ERROR!" color="red" radius="md" variant="filled">
              {error.message}
            </Alert>
          </Center>
        ) : (
          <>
            <UploadWidget revalidateData={mutate} />
            <DisplayMedia
              media={data.resources}
              mediaType={"image"}
              editorModal={true}
              selectImage={selectImage}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default TextEditor;
