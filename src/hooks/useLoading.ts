import axios, { Axios, AxiosRequestConfig } from 'axios'
import React, { useState } from 'react'
import useLoadingCallback from './useLoadingCallback'

type params = {
  path: string,
  axiosProps?: AxiosRequestConfig
}

const useLoading = ({path, axiosProps = {}}: params) => {
  const data = useLoadingCallback({
    callback: async () => {
      return (await axios({
        ...axiosProps,
        url: path,
        method: 'get'
      })).data
    }
  })

  return data
}

export default useLoading