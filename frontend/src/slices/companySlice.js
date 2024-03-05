import { apiSlice } from './apiSlice'

export const companySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompaniesForPagination: builder.query({
      query: ({ keyword, page }) => ({
        url: '/api/companies/paginate',
        params: { keyword, page },
      }),
      keepUnusedDataFor: 5,
    }),
    getCompanies: builder.query({
      query: () => ({
        url: '/api/companies',
      }),
      keepUnusedDataFor: 5,
    }),
    addCompany: builder.mutation({
      query: (data) => ({
        url: '/api/companies',
        method: 'POST',
        body: data,
      }),
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/api/companies/${id}`,
        method: 'DELETE',
      }),
    }),
    getCompany: builder.query({
      query: (id) => ({
        url: `/api/companies/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: `/api/companies/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})
export const {
  useGetCompaniesForPaginationQuery,
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} = companySlice
