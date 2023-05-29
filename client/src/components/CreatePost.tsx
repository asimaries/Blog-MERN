import React, { useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

export default function CreatePost() {

  const [title, setTitle] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [redirect, setRedirect] = useState<string|null>(null)


  async function createNewPost(e: React.FormEvent) {
    e.preventDefault()
    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.set('content', content);
    data.append('file', file);
    // console.log(file)
    // console.log(data)
    const response = await fetch('http://localhost:7000/post/create',
      { method: 'POST', body: data, credentials: 'include' });
    const res = await response.json();
    if (response.ok) {
      console.log(res.title)
      setRedirect(res.title);
    } else {
      alert('Error')
    }
  }
  if (redirect) return <Navigate to={`/post/${redirect}`} />

  return (
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
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        formats={formats}
        modules={modules} />
      <button>Create Post</button>
    </form>
  )
}
