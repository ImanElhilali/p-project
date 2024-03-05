import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const SearchBox = ({ search, searchComponent }) => {
  const navigate = useNavigate()

  const { keyword: urlKeyword, page: urlPage } = useParams()

  const [keyword, setKeyword] = useState(urlKeyword || '')
  const [page] = useState(urlPage || '')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword && searchComponent === 'transaction') {
      navigate(`/transactions/page/${page}/search/${keyword.trim()}`)
      setKeyword('')
    } else if (!keyword && searchComponent === 'transaction') {
      navigate(`/transactions/page/${page}`)
    }
    if (keyword && searchComponent === 'company') {
      navigate(`/admin/companylist/search/${keyword.trim()}/page/${page}`)
      setKeyword('')
    } else if (!keyword && searchComponent === 'company') {
      navigate(`/admin/companylist/page/${page}`)
    }
    if (keyword && searchComponent === 'pump') {
      navigate(`/admin/pumplist/page/${page}/search/${keyword.trim()}`)
      setKeyword('')
    } else if (!keyword && searchComponent === 'pump') {
      navigate(`/admin/pumplist/page/${page}`)
    }
    if (keyword && searchComponent === 'agent') {
      navigate(`/admin/agentlist/page/${page}/search/${keyword.trim()}`)
      setKeyword('')
    } else if (!keyword && searchComponent === 'agent') {
      navigate(`/admin/agentlist/page/${page}`)
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        autoComplete='off'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder={search}
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        بحث
      </Button>
    </Form>
  )
}

export default SearchBox
