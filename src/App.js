import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Toggable from './components/Toggable'
// import Notification from './components/Notification'
// import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'

const initialBlogState = { title: "", author: "", url: "" }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(initialBlogState)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [test, setTest] = useState('Nu niks')

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // const notesToShow = showAll
  //   ? blogs
  //   : blogs.filter(note => note.important)

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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

  }

  // const rows = () => notesToShow.map(note =>
  //   <Note
  //     key={note.id}
  //     note={note}
  //     toggleImportance={() => toggleImportanceOf(note.id)}
  //   />
  // )

  // const LoginForm = () => (
  //   <form onSubmit={handleLogin}>
  //     <div>
  //       username
  //       <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
  //     </div>
  //     <div>
  //       password
  //       <input
  //         type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
  //     </div>
  //     <button type="submit">login</button>
  //   </form>
  // )

  // const noteForm = () => (
  //   <form onSubmit={addNote}>
  //     <input
  //       value={newBlog}
  //       onChange={handleNoteChange}
  //     />
  //     <button type="submit">save</button>
  //   </form>
  // )

  // const handleNoteChange = (event) => {
  //   setNewBlog(event.target.value)
  // }

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


    // blogService
    //   .create(blogObject)
    //   .then(data => {
    //     setBlogs(blogs.concat(data))
    //     setNewBlog(initialBlogState)
    //   })
  }

  // const toggleImportanceOf = id => {
  //   const note = blogs.find(n => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   blogService
  //     .update(id, changedNote)
  //     .then(returnedNote => {
  //       setBlogs(blogs.map(note => note.id !== id ? note : returnedNote))
  //     })
  //     .catch(error => {
  //       setErrorMessage(
  //         `Note '${note.content}' was already removed from server`
  //       )
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //       setBlogs(blogs.filter(n => n.id !== id))
  //     })

  // }


  const setNewBlogState = (newBlogData) => {
    setNewBlog({ ...newBlog, ...newBlogData })
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App 