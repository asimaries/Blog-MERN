import React, { useState } from "react"
import { Navigate } from "react-router-dom";

import Editor from "./Editor";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function CreateBlog() {

  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [redirect, setRedirect] = useState<string>()

  const fetchAPI = useAxiosPrivate()

  async function createNewBlog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('summary', summary);
      formData.set('body', body);
      if (file) formData.set('file', file);

      const res = await fetchAPI.post('/blog/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data) {
        setRedirect(res.data.blogID);
      } else {
        alert('Error')
      }
    } catch (error) {
      console.error('Error :', error);
    }

  }
  return (
    redirect ? <Navigate to={`/blog/${redirect}`} /> : <>
      <form onSubmit={createNewBlog}>

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
          body={body}
          setBody={setBody} />

        <button>Create Blog</button>
      </form>
    </>
  )
}
