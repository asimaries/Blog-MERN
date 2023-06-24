import React, { useState } from "react"
import { Navigate } from "react-router-dom";

import Editor from "./Editor";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function CreatePost() {

  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [redirect, setRedirect] = useState<string>()

  const fetchAPI = useAxiosPrivate()

  async function createNewPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('summary', summary);
      formData.set('content', content);
      if (file) formData.set('file', file);

      const res = await fetchAPI.post('/post/create', formData)

      if (res.data) {
        setRedirect(res.data.postID);
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
