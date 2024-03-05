import { apiSlice } from './apiSlice'

export const transactionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsForPagination: builder.query({
      query: ({ keyword, page }) => ({
        url: '/api/transactions/pagination',
        params: { keyword, page },
      }),
      keepUnusedDataFor: 5,
    }),
    getTransactions: builder.query({
      query: () => ({
        url: '/api/transactions',
      }),
      keepUnusedDataFor: 5,
    }),
    // getTransactionsForReports: builder.query({
    //   query: ({ keyword }) => ({
    //     url: '/api/transactions/reports',
    //     params: { keyword },
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
    getTransactionById: builder.query({
      query: (id) => ({
        url: `/api/transactions/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addTransaction: builder.mutation({
      query: (data) => ({
        url: '/api/transactions',
        method: 'POST',
        body: data,
      }),
    }),
    updateTransaction: builder.mutation({
      query: (data) => ({
        url: `/api/transactions/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/api/transactions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})
export const {
  useGetTransactionsForPaginationQuery,
  useGetTransactionsQuery,
  // useGetTransactionsForReportsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionSlice
