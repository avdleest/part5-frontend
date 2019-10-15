import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Toggable from './components/Toggable'
// import Notification from './components/Notification'
// import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'

const initialBlogState = { title: '', author: '', url: '' }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(initialBlogState)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      setPassword('')
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
    // console.log(`Do you really want to remove blog ${blog.title} by ${blog.author}?`)
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

  if (user === null) {
    return (
      <div>
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
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