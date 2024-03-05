import { Pagination } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({
  pages,
  page,
  keyword = '',
  isAdmin = false,
  href = '',
}) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? keyword === 'جازولين وارد حدود الولاية' ||
                    keyword === 'بنزين' ||
                    keyword === 'جازولين' ||
                    keyword === 'غاز الطبخ' ||
                    keyword === 'غاز المخابز' ||
                    keyword === 'أسماء الوكلاء' ||
                    keyword === 'عدد الطلمبات'
                    ? `/reports/${keyword}/${x + 1}`
                    : `/search/${keyword}/page/${x + 1}`
                  : `/transactions/page/${x + 1}`
                : href === 'companies'
                ? `/admin/companylist/page/${x + 1}`
                : href === 'agents'
                ? `/admin/agentlist/page/${x + 1}`
                : href === 'pumps'
                ? `/admin/pumplist/page/${x + 1}`
                : '/'
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  )
}

export default Paginate
