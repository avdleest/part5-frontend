import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

test('renders content', () => {
  const blog = {
    title: 'This is a great title',
    author: 'A great guy',
    likes: 5
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  const div1 = component.container.querySelector('.title')

  expect(div1).toHaveTextContent('This is a great title')
  expect(div1).toHaveTextContent('A great guy')

  const div2 = component.container.querySelector('.likes')

  expect(div2).toHaveTextContent('5')

})

test('clicking the like button twice calls event handler twice', () => {
  const blog = {
    title: 'This is a great title',
    author: 'A great guy',
    likes: 5
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})