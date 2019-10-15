import React from 'react'
const BlogForm = ({ onChange, values, onSubmit }) => {

  // const handleChange = (e) => {
  //   setBlog({ ...Blog, [e.target.name]: e.target.value })
  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   onSubmit
  // }

  const handleChange = (e) => {
    // onChange({ ...Blog, [e.target.name]: e.target.value })
    onChange({ [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input type="text" value={values.title} name="title" onChange={handleChange} />
        </div>
        <div>
          author:
          <input type="text" value={values.author} name="author" onChange={handleChange} />
        </div>
        <div>
          url:
          <input type="text" value={values.url} name="url" onChange={handleChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm