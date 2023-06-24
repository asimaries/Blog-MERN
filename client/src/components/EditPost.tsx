import React, { useState, useEffect, useContext } from "react"
// import FormData from "form-data";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";
import { UserContext, UserContextType } from "../context/user";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function EditPost() {

  const { user } = useContext<UserContextType>(UserContext)

  const { id } = useParams()
  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File | undefined>()
  const [redirect, setRedirect] = useState<string | null>(null)

  const fetchAPI = useAxiosPrivate()
  const getPost = async () => {
    // const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}`)
    // const respost = await res.json();
    const respost = await fetchAPI.get(`/post/${id}`)
    setTitle(respost.data?.title)
    setSummary(respost.data?.summary)
    setContent(respost.data?.content)
    setFile(respost.data?.cover)
  }

  useEffect(() => {
    getPost()
  }, [user.name])


  async function editNewPost(e: React.FormEvent) {

    e.preventDefault()
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.append('content', content);
    if (file) data.append('file', file);
    const response = await fetchAPI.patch(`/post/${id}/edit`, data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

    if (response.data) {
      setRedirect(response.data.postID);
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
