import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  // baseUrl: '',
  baseUrl: `https://tutorial-project-api.onrender.com/`,
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Company', 'Local', 'User', 'Agent', 'Pump', 'PumpType'],
  endpoints: (builder) => ({}),
})
