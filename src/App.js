import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
// import LoginForm from './components/LoginForm'
import Toggable from './components/Toggable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'

const initialBlogState = { title: '', author: '', url: '' }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(initialBlogState)
  const [user, setUser] = useState(null)
  const username = useField('text')
  const password = useField('password')

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs.sort((a, b) => (a.likes > b.likes) ? 1 : -1)))

  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(
        { username: username.value, password: password.value }
      )
      console.log(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (exception) {
      console.log('wrong credentials')
      password.reset()
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

  }

  const blogFormRef = React.createRef()

  const addBlog = async (e) => {
    e.preventDefault()
    blogFormRef.current.toggleVisibility()

    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    const blog = await blogService.create(blogObject)

    setBlogs(blogs.concat(blog))
    setNewBlog(initialBlogState)

  }

  const setNewBlogState = newBlogData => {
    setNewBlog({ ...newBlog, ...newBlogData })
  }

  const deleteHandler = async blog => {
    if (!window.confirm(`Do you really want to remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }

    try {
      await blogService.del(blog.id)
      setBlogs(blogs.filter(existingBlog => existingBlog.id !== blog.id))
    } catch (exception) {
      console.log(exception)
    }

  }

  const likeHandler = async blog => {

    try {
      const blogObject = {
        id: blog.id,
        title: (blog.title || ''),
        author: (blog.author || ''),
        url: (blog.url || ''),
        likes: (blog.likes || 0) + 1
      }

      if (blog.user) blogObject.user = blog.user.id

      const updatedBlog = await blogService.update(blog.id, blogObject)
      console.log(updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (exception) {
      console.log(exception)
    }
  }

  //I haven't been able to solve the problem with the spread operator

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input {...username} />
          </div>
          <div>
            password
            <input {...password} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <p>{user.name} logged in<button type="logout" onClick={handleLogout}>logout</button></p>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm onChange={setNewBlogState} values={newBlog} onSubmit={addBlog} />
      </Toggable>
      <h2>blogs</h2>
      {}
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          likeHandler={likeHandler}
          deleteHandler={deleteHandler}
          user={user} />
      )}
    </div>
  )
}

export default App