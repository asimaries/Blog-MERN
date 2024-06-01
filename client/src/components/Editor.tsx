import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

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

interface EditorProp {
  body: string,
  setBody: React.Dispatch<React.SetStateAction<string>>,
}

export default function Editor({ body, setBody }: EditorProp) {
  return (
    <ReactQuill
      theme="snow"
      value={body}
      onChange={setBody}
      formats={formats}
      modules={modules} />
  )
}
