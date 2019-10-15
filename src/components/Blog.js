import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeHandler, deleteHandler, user }) => {
  const [visible, setVisible] = useState(false)
  const [delVisible, setDelVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const showDelWhenVisible = { display: delVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDelVisiblity = () => {
    try {
      // console.log(`blog user: ${blog.user.name}, user:`, user.name)
      if (!blog.user || blog.user.name === user.name) {
        setDelVisible(true)
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    handleDelVisiblity()
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  return (
    <div style={blogStyle}>
      <div onClick={toggleVisibility}>
        {blog.title} {blog.author}
      </div>
      <div style={showWhenVisible}>
        <a href={blog.url} target='_blank' rel='noopener noreferrer'>{blog.url}</a><br />
        {blog.likes} likes <button onClick={() => likeHandler(blog)}>like</button><br />
        {blog.user ? `Added by ${blog.user.name}` : ''} <br />
        <button style={showDelWhenVisible} onClick={() => deleteHandler(blog)}>remove</button>
      </div>
    </div>

  )
}

export default Blog