import React, { useState, useEffect, useContext } from "react"
// import FormData from "form-data";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { useUser } from "../context/user";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function EditBlog() {

  const { user } = useUser()

  const { id } = useParams()
  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [file, setFile] = useState<File | undefined>()
  const [redirect, setRedirect] = useState<string | null>(null)

  const fetchAPI = useAxiosPrivate()
  const getBlog = async () => {
    // const res = await fetch(`${import.meta.env.VITE_API_URL}/blog/${id}`)
    // const resblog = await res.json();
    const resblog = await fetchAPI.get(`/blog/${id}`)
    setTitle(resblog.data?.title)
    setSummary(resblog.data?.summary)
    setBody(resblog.data?.body)
    setFile(resblog.data?.cover)
  }

  useEffect(() => {
    getBlog()
  }, [user.name])


  async function editNewBlog(e: React.FormEvent) {

    e.preventDefault()
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.append('body', body);
    if (file) data.append('file', file);
    const response = await fetchAPI.patch(`/blog/${id}/edit`, data, {
      headers: { 'Body-Type': 'multipart/form-data' }
    });

    if (response.data) {
      setRedirect(response.data.blogID);
    } else {
      alert('Error')
    }
  }

  if (redirect) return <Navigate to={`/blog/${redirect}`} />
  return (
    <form onSubmit={editNewBlog}>

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

      <button>Edit Blog</button>

    </form>
  )
}
