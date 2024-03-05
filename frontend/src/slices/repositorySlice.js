import { apiSlice } from './apiSlice'

export const repositorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRepository: builder.query({
      query: () => ({
        url: `/api/repositories`,
      }),
      keepUnusedDataFor: 5,
    }),
    getRepositoryById: builder.query({
      query: (id) => ({
        url: `/api/repositories/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addRepository: builder.mutation({
      query: (data) => ({
        url: `/api/repositories`,
        method: 'POST',
        body: data,
      }),
    }),
    updateRepository: builder.mutation({
      query: (data) => ({
        url: `/api/repositories/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRepository: builder.mutation({
      query: (id) => ({
        url: `/api/repositories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})
export const {
  useGetRepositoryQuery,
  useGetRepositoryByIdQuery,
  useAddRepositoryMutation,
  useUpdateRepositoryMutation,
  useDeleteRepositoryMutation,
} = repositorySlice
