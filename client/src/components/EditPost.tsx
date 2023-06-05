import React, { useState, useEffect } from "react"

import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";


export default function EditPost() {

  const { id } = useParams()
  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File | undefined>()
  const [redirect, setRedirect] = useState<string | null>(null)

  const getPost = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}`)
    const respost = await res.json();
    setTitle(respost.title)
    setSummary(respost.summary)
    setContent(respost.content)
    setFile(respost?.cover)
  }

  useEffect(() => {
    getPost()
  }, [id])


  async function editNewPost(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()
    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.set('content', content);
    if (file) data.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}/edit`,
      { method: 'PATCH', body: data, credentials: 'include' });
    const res = await response.json();

    if (response.ok) {
      setRedirect(res.postID);
    } else {
      alert('Error')
    }
  }

  if (redirect) return <Navigate to={`/post/${redirect}`} />

  return (
    <form onSubmit={editNewPost}>

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

      <button>Edit Post</button>

    </form>
  )
}
