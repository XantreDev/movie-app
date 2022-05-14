import { useCallback } from 'react';
import { useContext } from 'react';
import React from 'react'
import { indexesRefContext } from '../contexts/MoviesDataProvider';

const useRowLastPage = (genreId: number) => {
  const metaDataRef = useContext(indexesRefContext)

  const increment = () => {
    if (genreId in metaDataRef.current.rowLastPage) {
      metaDataRef.current.rowLastPage[genreId]++
    }
  }

  const getPageNumber = () => metaDataRef.current.rowLastPage?.[genreId] ?? 1

  return [getPageNumber, increment] as [() => number, () => void ]
}

export default useRowLastPage