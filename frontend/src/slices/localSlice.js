import { apiSlice } from './apiSlice'

export const localSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocals: builder.query({
      query: () => ({
        url: '/api/locals',
      }),
      keepUnusedDataFor: 5,
    }),
    getLocal: builder.query({
      query: (id) => ({
        url: `/api/locals/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addLocal: builder.mutation({
      query: (data) => ({
        url: '/api/locals',
        method: 'POST',
        body: data,
      }),
    }),
    updateLocal: builder.mutation({
      query: (data) => ({
        url: `/api/locals/${data._id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteLocal: builder.mutation({
      query: (id) => ({
        url: `/api/locals/${id}`,
        method: 'DELETE',
      }),
    }),
    getUnits: builder.query({
      query: (id) => ({
        url: `/api/locals/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getUnit: builder.query({
      query: ({ id, unitID }) => ({
        url: `/api/locals/${id}/units/${unitID}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addUnit: builder.mutation({
      query: (data) => ({
        url: `/api/locals/${data._id}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUnit: builder.mutation({
      query: (data) => ({
        url: `/api/locals/${data.id}/units/${data.unitID}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUnit: builder.mutation({
      query: ({ id, unitID }) => ({
        url: `/api/locals/${id}/units/${unitID}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetLocalsQuery,
  useGetLocalQuery,
  useAddLocalMutation,
  useUpdateLocalMutation,
  useDeleteLocalMutation,
  useGetUnitsQuery,
  useGetUnitQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = localSlice
