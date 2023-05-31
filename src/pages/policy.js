import { useState, useEffect, useRef } from "react";
import TextEditor from "@/components/editor/TextEditor";

const Policy = () => {
  const [editorContent, setEditorContent] = useState("");

  return (
    <>
      <h1>Privacy policy</h1>
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
    </>
  );
};

export default Policy;
