import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  // baseUrl: '',
  baseUrl: `https://p-project-api.onrender.com/`,
})

export const apiSlice = createApi({
  baseQuery,
  credentials: 'include',
  tagTypes: ['Company', 'Local', 'User', 'Agent', 'Pump', 'PumpType'],
  endpoints: (builder) => ({}),
})
