import { apiSlice } from './apiSlice'

export const agentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgentsForPagination: builder.query({
      query: ({ keyword, page }) => ({
        url: `/api/agents/paginate`,
        params: { keyword, page },
      }),
      keepUnusedDataFor: 5,
    }),
    getAgents: builder.query({
      query: () => ({
        url: `/api/agents`,
      }),
      keepUnusedDataFor: 5,
    }),
    getAgentById: builder.query({
      query: (id) => ({
        url: `/api/agents/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addAgent: builder.mutation({
      query: (data) => ({
        url: `/api/agents`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteAgent: builder.mutation({
      query: (id) => ({
        url: `/api/agents/${id}`,
        method: 'DELETE',
      }),
    }),
    updateAgent: builder.mutation({
      query: (data) => ({
        url: `/api/agents/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})
export const {
  useGetAgentsForPaginationQuery,
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  useAddAgentMutation,
  useDeleteAgentMutation,
  useUpdateAgentMutation,
} = agentSlice
