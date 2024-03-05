import { apiSlice } from './apiSlice'

export const pumpSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPumpsForPagination: builder.query({
      query: ({ keyword, page }) => ({
        url: `/api/pumps/pagination`,
        params: { keyword, page },
      }),
      keepUnusedDataFor: 5,
    }),
    getPumps: builder.query({
      query: () => ({
        url: `/api/pumps`,
      }),
      keepUnusedDataFor: 5,
    }),
    getPumpById: builder.query({
      query: (id) => ({
        url: `/api/pumps/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addPump: builder.mutation({
      query: (data) => ({
        url: `/api/pumps`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePump: builder.mutation({
      query: (data) => ({
        url: `/api/pumps/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePump: builder.mutation({
      query: (id) => ({
        url: `/api/pumps/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetPumpsForPaginationQuery,
  useGetPumpsQuery,
  useGetPumpByIdQuery,
  useAddPumpMutation,
  useUpdatePumpMutation,
  useDeletePumpMutation,
} = pumpSlice
