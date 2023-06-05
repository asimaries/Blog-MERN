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
  content: string,
  setContent: React.Dispatch<React.SetStateAction<string>>,
}

export default function Editor({ content, setContent }: EditorProp) {
  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      formats={formats}
      modules={modules} />
  )
}
