import React, { useState } from "react"
import { Navigate } from "react-router-dom";

import Editor from "./Editor";

export default function CreatePost() {

  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [redirect, setRedirect] = useState<string>()


  async function createNewPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (summary) formData.append('summary', summary);
      if (content) formData.append('content', content);
      if (file) formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/post/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const res = await response.json();

      if (response.ok) {
        setRedirect(res.postID);
      } else {
        alert('Error')
      }
    } catch (error) {
      console.error('Error :', error);
    }

  }

  return (
    redirect ? <Navigate to={`/post/${redirect}`} /> : <>
      <form onSubmit={createNewPost}>

        <input type="title"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} />

        <input type="summary"
          placeholder="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)} />

        <input type="file"
          onChange={(e) => setFile(e.target.files?.[0])} />

        <Editor
          content={content}
          setContent={setContent} />

        <button>Create Post</button>
      </form>
    </>
  )
}
