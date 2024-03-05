import { apiSlice } from './apiSlice'

export const pumpTypeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPumpTypes: builder.query({
      query: () => ({
        url: `/api/pumpTypes`,
      }),
      keepUnusedDataFor: 5,
    }),
    getPumpTypeById: builder.query({
      query: (id) => ({
        url: `/api/pumpTypes/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addPumpType: builder.mutation({
      query: (data) => ({
        url: `/api/pumpTypes`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePumpType: builder.mutation({
      query: (data) => ({
        url: `/api/pumpTypes/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePumpType: builder.mutation({
      query: (id) => ({
        url: `/api/pumpTypes/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})
export const {
  useGetPumpTypesQuery,
  useGetPumpTypeByIdQuery,
  useAddPumpTypeMutation,
  useUpdatePumpTypeMutation,
  useDeletePumpTypeMutation,
} = pumpTypeSlice
