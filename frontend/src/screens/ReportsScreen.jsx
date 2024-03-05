import { useState, useEffect } from 'react'
import { Container, Table, Row, Col, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { useGetTransactionsQuery } from '../slices/transactionSlice'
import { useGetPumpsQuery } from '../slices/pumpSlice'

const ReportsScreen = () => {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [selectedReport, setSelectedReport] = useState('')

  const [pumpsInACompany, setPumpsInACompany] = useState([])
  const [pumpsInState, setPumpsInState] = useState([])
  const [currentPumps, setCurrentPumps] = useState([])
  const [currentPumpsInCompany, setCurrentPumpsInCompany] = useState([])

  const [results, setResults] = useState([])
  const [groupResult, setGroupResult] = useState([])
  const { page } = useParams()
  const [keyword, setKeyword] = useState('')
  const pageSize = 12

  const [pages, setPages] = useState(1)

  // const { keyword: urlKeyword, page } = useParams()
  // const [keyword, setKeyword] = useState(urlKeyword || '')

  const indexOfLastTransaction = page * pageSize
  const indexOfFirstTransaction = indexOfLastTransaction - pageSize
  const [currentTransactions, setCurrentTransactions] = useState([])

  const reports = [
    'كمية الجازولين وارد الحدود الواصل للولاية حسب الشركات',
    'كمية الجازولين وارد الحدود الواصل للمحليات حسب الشركات',
    'كمية البنزين الواصل للولاية حسب الشركات',
    'كمية البنزين الواصل للمحليات حسب الشركات',
    'كمية الجازولين الواصل للولاية حسب الشركات',
    'كمية الجازولين الواصل للمحليات حسب الشركات',
    'غاز الطبخ الواصل للولاية حسب الشركات',
    'غاز الطبخ الواصل للمحليات حسب الشركات',
    'غاز المخابز الواصل للولاية حسب الشركات',
    'غاز المخابز الواصل للمحليات حسب الشركات',
    'تقرير بأسماء الوكلاء ومحطات الخدمة بالولاية',
    'تقرير يوضح عدد الطلمبات التابعة لكل شركة',
  ]

  const { data: transactions } = useGetTransactionsQuery()
  const { data: pumps } = useGetPumpsQuery()

  const navigate = useNavigate()

  useEffect(() => {
    if (selectedReport) {
      switch (selectedReport) {
        case 'كمية الجازولين وارد الحدود الواصل للولاية حسب الشركات':
          return setKeyword('جازولين وارد حدود الولاية')
        case 'كمية الجازولين وارد الحدود الواصل للمحليات حسب الشركات':
          return setKeyword('جازولين وارد حدود الولاية')
        case 'كمية البنزين الواصل للولاية حسب الشركات':
          return setKeyword('بنزين')
        case 'كمية البنزين الواصل للمحليات حسب الشركات':
          return setKeyword('بنزين')
        case 'كمية الجازولين الواصل للولاية حسب الشركات':
          return setKeyword('جازولين')
        case 'كمية الجازولين الواصل للمحليات حسب الشركات':
          return setKeyword('جازولين')
        case 'غاز الطبخ الواصل للولاية حسب الشركات':
          return setKeyword('غاز الطبخ')
        case 'غاز الطبخ الواصل للمحليات حسب الشركات':
          return setKeyword('غاز الطبخ')
        case 'غاز المخابز الواصل للولاية حسب الشركات':
          return setKeyword('غاز المخابز')
        case 'غاز المخابز الواصل للمحليات حسب الشركات':
          return setKeyword('غاز المخابز')
        case 'تقرير بأسماء الوكلاء ومحطات الخدمة بالولاية':
          return setKeyword('أسماء الوكلاء')
        case 'تقرير يوضح عدد الطلمبات التابعة لكل شركة':
          return setKeyword('عدد الطلمبات')
        default:
          setKeyword('التقارير')
      }
    }
  }, [selectedReport])

  useEffect(() => {
    if (keyword) {
      navigate(`/reports/${keyword}/1`)
    }
  }, [keyword, navigate])

  useEffect(() => {
    if (
      endDate &&
      startDate &&
      keyword !== 'أسماء الوكلاء' &&
      keyword !== 'عدد الطلمبات'
    ) {
      const results = transactions
        .filter(
          (transaction) =>
            transaction.pumpType === keyword &&
            new Date(transaction.date.substring(0, 19)).getTime() >=
              new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                0,
                0,
                0
              ).getTime() &&
            new Date(transaction.date.substring(0, 19)).getTime() <=
              new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(23, 59, 0)
              ).getTime()
        )
        .sort((a, b) =>
          new Date(a.date.substring(0, 19)).getTime() >=
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0,
            0,
            0
          ).getTime() >
          new Date(b.date.substring(0, 19)).getTime() <=
          new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(23, 59, 0)
          ).getTime()
            ? 1
            : -1
        )
      setResults(results)
      console.log(results)
      // console.log(data.pages)
    }
  }, [keyword, page])

  useEffect(() => {
    if (results) {
      const pages =
        results.length <= pageSize
          ? 1
          : results.length % pageSize > 0
          ? Math.ceil(results.length / pageSize)
          : results.length / pageSize
      setPages(pages)

      let groupResult = results.reduce(groupBy, [])
      setGroupResult(groupResult)
      setCurrentTransactions(
        results.slice(indexOfFirstTransaction, indexOfLastTransaction)
      )
    }
  }, [results])

  const groupBy = (genericArray, curr) => {
    const { company, arrivedQty } = curr
    const itemFound = genericArray.find((item) => item.company === company)
    if (itemFound) {
      itemFound.arrivedQty =
        parseInt(itemFound.arrivedQty) + parseInt(arrivedQty)
    } else {
      const newItemFound = { company, arrivedQty }
      genericArray.push(newItemFound)
    }
    return genericArray
  }

  useEffect(() => {
    if (keyword === 'أسماء الوكلاء') {
      const pages =
        pumps.length <= pageSize
          ? 1
          : pumps.length % pageSize > 0
          ? Math.ceil(pumps.length / pageSize)
          : pumps.length / pageSize
      setPages(pages)
    }
    if (keyword === 'عدد الطلمبات') {
      const pages =
        pumpsInACompany.length <= pageSize
          ? 1
          : pumpsInACompany.length % pageSize > 0
          ? Math.ceil(pumpsInACompany.length / pageSize)
          : pumpsInACompany.length / pageSize
      setPages(pages)
    }
  }, [pumps, keyword])

  useEffect(() => {
    if (page) {
      // if (results) {
      //   setCurrentTransactions(
      //     results.slice(indexOfFirstTransaction, indexOfLastTransaction)
      //   )
      // }
      if (pumps) {
        setCurrentPumps(
          pumps.slice(indexOfFirstTransaction, indexOfLastTransaction)
        )
      }
      if (pumpsInACompany) {
        setCurrentPumpsInCompany(
          pumpsInACompany.slice(indexOfFirstTransaction, indexOfLastTransaction)
        )
      }
    }
  }, [page])

  useEffect(() => {
    if (pumps) {
      let Arr = pumps.map((item) => item.company)
      let tempArr = Arr.sort()
      let companyOccurences = []
      let count = 1

      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] === tempArr[i + 1]) {
          count++
        } else {
          let value = { item: tempArr[i], count: count }
          companyOccurences.push(value)
          count = 1
        }
      }
      setPumpsInACompany(companyOccurences)
    }
  }, [pumps])

  useEffect(() => {
    let y = pumpsInACompany.map((item) => item.count)
    let x = y.reduce((total, item) => (total += item), 0)
    setPumpsInState(x)
  }, [pumpsInACompany])

  return (
    <Container>
      <Row>
        <Col md={6}>
          {' '}
          <h1>التقارير</h1>
          <Form.Select
            aria-label='Default select example'
            style={{ display: 'inline-block' }}
            value={selectedReport}
            onChange={(e) => {
              setSelectedReport(e.target.value)
              navigate(`/reports`)
            }}
          >
            <option>التقارير</option>
            {reports.map((report, index) => (
              <option key={index} value={report}>
                {report}
              </option>
            ))}
          </Form.Select>
        </Col>{' '}
        <Col style={{ marginTop: '56px', marginRight: '10px' }}>
          <DatePicker
            className='form-control dateInput date'
            selected={startDate}
            selectsStart
            onChange={(date) => setStartDate(date)}
            startDate={startDate}
            endDate={endDate}
            placeholderText='تاريخ بداية الفترة'
            dateFormat='dd/MM/yyyy'
          />{' '}
          <DatePicker
            className='form-control dateInput date'
            selected={endDate}
            selectsEnd
            onChange={(date) => setEndDate(date)}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText='تاريخ نهاية الفترة'
            dateFormat='dd/MM/yyyy'
          />
          <br />
          <br />
        </Col>
      </Row>

      {(() => {
        switch (selectedReport) {
          case 'كمية الجازولين وارد الحدود الواصل للولاية حسب الشركات':
            return (
              currentTransactions && (
                <>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الشركة</th>
                            <th>النوع</th>
                            <th>الكمية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>
                                {moment(transaction.date).format('DD/MM/YYYY')}
                              </td>
                              <td>{transaction.company}</td>
                              <td>{transaction.pumpType}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                  <br />
                  <h5>ملخص الجازولين وارد الحدود الواصل حسب الشركات</h5>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>الشركة</th>
                            <th>الكمية الواصلة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupResult.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.company}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                </>
              )
            )
          case 'كمية الجازولين وارد الحدود الواصل للمحليات حسب الشركات':
            return (
              currentTransactions && (
                <Row className='justify-content-md-center my-2'>
                  <Col md={7}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الشركة</th>
                          <th>المحلية</th>
                          <th>النوع</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              {moment(transaction.date).format('DD/MM/YYYY')}
                            </td>
                            <td>{transaction.company}</td>
                            <td>{transaction.local}</td>
                            <td>{transaction.pumpType}</td>
                            <td>{transaction.arrivedQty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'كمية البنزين الواصل للولاية حسب الشركات':
            return (
              currentTransactions && (
                <>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الشركة</th>
                            <th>النوع</th>
                            <th>الكمية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>
                                {moment(transaction.date).format('DD/MM/YYYY')}
                              </td>
                              <td>{transaction.company}</td>
                              <td>{transaction.pumpType}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                  <br />
                  <h5>ملخص البنزين الواصل حسب الشركات</h5>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>الشركة</th>
                            <th>الكمية الواصلة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupResult.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.company}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                </>
              )
            )
          case 'كمية البنزين الواصل للمحليات حسب الشركات':
            return (
              currentTransactions && (
                <Row className='justify-content-md-center my-2'>
                  <Col md={7}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الشركة</th>
                          <th>المحلية</th>
                          <th>النوع</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              {moment(transaction.date).format('DD/MM/YYYY')}
                            </td>
                            <td>{transaction.company}</td>
                            <td>{transaction.local}</td>
                            <td>{transaction.pumpType}</td>
                            <td>{transaction.arrivedQty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'كمية الجازولين الواصل للولاية حسب الشركات':
            return (
              currentTransactions && (
                <>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الشركة</th>
                            <th>النوع</th>
                            <th>الكمية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>
                                {moment(transaction.date).format('DD/MM/YYYY')}
                              </td>
                              <td>{transaction.company}</td>
                              <td>{transaction.pumpType}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                  <br />
                  <h5>ملخص الجازولين الواصل حسب الشركات</h5>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>الشركة</th>
                            <th>الكمية الواصلة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupResult.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.company}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                </>
              )
            )
          case 'كمية الجازولين الواصل للمحليات حسب الشركات':
            return (
              currentTransactions && (
                <Row className='justify-content-md-center my-2'>
                  <Col md={7}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الشركة</th>
                          <th>المحلية</th>
                          <th>النوع</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              {moment(transaction.date).format('DD/MM/YYYY')}
                            </td>
                            <td>{transaction.company}</td>
                            <td>{transaction.local}</td>
                            <td>{transaction.pumpType}</td>
                            <td>{transaction.arrivedQty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'غاز الطبخ الواصل للولاية حسب الشركات':
            return (
              currentTransactions && (
                <>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الشركة</th>
                            <th>النوع</th>
                            <th>الكمية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>
                                {moment(transaction.date).format('DD/MM/YYYY')}
                              </td>
                              <td>{transaction.company}</td>
                              <td>{transaction.pumpType}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                  <br />
                  <h5>ملخص غاز الطبخ الواصل حسب الشركات</h5>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>الشركة</th>
                            <th>الكمية الواصلة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupResult.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.company}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                </>
              )
            )
          case 'غاز الطبخ الواصل للمحليات حسب الشركات':
            return (
              currentTransactions && (
                <Row className='justify-content-md-center my-2'>
                  <Col md={7}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الشركة</th>
                          <th>المحلية</th>
                          <th>النوع</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              {moment(transaction.date).format('DD/MM/YYYY')}
                            </td>
                            <td>{transaction.company}</td>
                            <td>{transaction.local}</td>
                            <td>{transaction.pumpType}</td>
                            <td>{transaction.arrivedQty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'غاز المخابز الواصل للولاية حسب الشركات':
            return (
              currentTransactions && (
                <>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الشركة</th>
                            <th>النوع</th>
                            <th>الكمية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>
                                {moment(transaction.date).format('DD/MM/YYYY')}
                              </td>
                              <td>{transaction.company}</td>
                              <td>{transaction.pumpType}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                  <br />
                  <h5>ملخص غاز المخابز الواصل حسب الشركات</h5>
                  <Row className='justify-content-md-center my-2'>
                    <Col md={7}>
                      <Table
                        striped
                        hover
                        responsive
                        bordered
                        className='table-sm'
                      >
                        <thead>
                          <tr>
                            <th>الشركة</th>
                            <th>الكمية الواصلة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupResult.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.company}</td>
                              <td>{transaction.arrivedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Paginate pages={pages} page={page} keyword={keyword} />
                    </Col>
                  </Row>
                </>
              )
            )
          case 'غاز المخابز الواصل للمحليات حسب الشركات':
            return (
              currentTransactions && (
                <Row className='justify-content-md-center my-2'>
                  <Col md={7}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الشركة</th>
                          <th>المحلية</th>
                          <th>النوع</th>
                          <th>الكمية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              {moment(transaction.date).format('DD/MM/YYYY')}
                            </td>
                            <td>{transaction.company}</td>
                            <td>{transaction.local}</td>
                            <td>{transaction.pumpType}</td>
                            <td>{transaction.arrivedQty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'تقرير بأسماء الوكلاء ومحطات الخدمة بالولاية':
            return (
              currentPumps && (
                <Row className='justify-content-md-center'>
                  <Col md={5}>
                    <Table
                      striped
                      hover
                      responsive
                      bordered
                      className='table-sm'
                    >
                      <thead>
                        <tr>
                          <th>الوكلاء</th>
                          <th>محطات الخدمة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPumps.map((pump) => (
                          <tr key={pump._id}>
                            <td>{pump.agent}</td>
                            <td>{pump.pump}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                  </Col>
                </Row>
              )
            )
          case 'تقرير يوضح عدد الطلمبات التابعة لكل شركة':
            return (
              <Row className='justify-content-md-center my-2'>
                <Col md={5}>
                  <Table striped hover responsive bordered className='table-sm'>
                    <thead>
                      <tr>
                        <th>الشركة</th>
                        <th>عدد المحطات</th>
                        <th>النسبة %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPumpsInCompany.map((item) => {
                        return (
                          <tr>
                            <td>{item.item}</td>
                            <td>{item.count}</td>
                            <td>
                              {`${((item.count * 100) / pumpsInState).toFixed(
                                2
                              )}`}{' '}
                            </td>
                          </tr>
                        )
                      })}
                      <th>عدد الطلمبات بالولاية</th>
                      <td>{pumpsInState}</td>
                    </tbody>
                  </Table>
                  <Paginate pages={pages} page={page} keyword={keyword} />
                </Col>
              </Row>
            )
          default:
            return null
        }
      })()}
    </Container>
  )
}

export default ReportsScreen
