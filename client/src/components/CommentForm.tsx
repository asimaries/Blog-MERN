import { FormEvent, useRef, useState } from "react"

export default function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "" }: {
    loading: boolean,
    error: any,
    onSubmit: any,
    autoFocus?: boolean,
    initialValue?: string
  }) {
  const [message, setMessage] = useState(initialValue)
  // const messageRef = useRef<HTMLTextAreaElement>(null)
  // messageRef.current!.value = initialValue

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(message).then(() => setMessage(""))
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          value={message}
          // ref={messageRef}
          autoFocus={autoFocus}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input" />
        <button className="comment btn" type="submit" disabled={loading}>
          {loading ? "Loading" : "Post"}
        </button>
      </div>
      <div className="error-msg"> {error}</div>
    </form>
  )
}