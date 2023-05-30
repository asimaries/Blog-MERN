import React, { useState } from "react"
import { Navigate } from "react-router-dom";

import Editor from "./Editor";

export default function CreatePost() {

  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [redirect, setRedirect] = useState<string | null>(null)


  async function createNewPost(e: React.FormEvent) {
    e.preventDefault()

    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.set('content', content);
    data.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/post/create`,
      { method: 'POST', body: data, credentials: 'include' });
    const res = await response.json();

    if (response.ok) {
      setRedirect(res.postID);
    } else {
      alert('Error')
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
