import React, { useEffect, useState } from 'react'

type LoadingStatus = 'loading' | 'loaded' | 'failed'
type Arguments = {
  callback: <T,>() => Promise<T>
}


const useLoadingCallback = ({callback}: Arguments) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('loading')
  const [data, setData] = useState({} as Awaited<ReturnType<typeof callback>>)

  useEffect(() => {
    const fetch = async() => {
      const result = await callback()
      
      setData(result)
    }

    try {
      fetch()
      setLoadingStatus('loaded')
    } catch {
      setLoadingStatus('failed')
    }
  } 
  ,[])

  return [loadingStatus, data] as [LoadingStatus, typeof data]

}

export default useLoadingCallback