import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  // baseUrl: '',
  baseUrl: `https://p-project-api.onrender.com/`,
  credentials: 'include',
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Company', 'Local', 'User', 'Agent', 'Pump', 'PumpType'],
  endpoints: (builder) => ({}),
})
