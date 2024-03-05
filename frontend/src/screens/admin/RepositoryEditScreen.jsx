import { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useGetRepositoryQuery,
  useGetRepositoryByIdQuery,
  useUpdateRepositoryMutation,
} from '../../slices/repositorySlice'

const RepositoryEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(true)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const handleClose = () => {
    setShow(false)
    navigate('/admin/repositorylist')
  }

  const { data: repositories } = useGetRepositoryQuery()
  const { data: repository, refetch } = useGetRepositoryByIdQuery(id)
  const [updateRepository] = useUpdateRepositoryMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (handleValidation()) {
      try {
        await updateRepository({ id, name }).unwrap()
        refetch()
        handleClose()
        navigate('/admin/repositorylist')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const handleValidation = () => {
    let formIsValid = true

    const restOfRepositories = repositories.filter(
      (repository) => repository._id !== id
    )
    const namesOfRepositories = restOfRepositories.map(
      (repository) => repository.name
    )
    const nameExists = namesOfRepositories.find(
      (reposName) => reposName === name
    )
    if (nameExists) {
      setError('هذا الاسم موجود مسبقاً')
      formIsValid = false
    }

    return formIsValid
  }

  useEffect(() => {
    if (repository) {
      setName(repository.name)
    }
  }, [repository])
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>تعديل اسم المستودع</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='repository'>
              <Form.Control
                type='text'
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
              <br />
              <span style={{ color: 'red' }}>{error}</span>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-success' onClick={handleClose}>
            اغلاق
          </Button>
          <Button variant='success' onClick={submitHandler}>
            تعديل
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RepositoryEditScreen
