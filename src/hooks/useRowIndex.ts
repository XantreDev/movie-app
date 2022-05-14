import { useEffect, useState } from 'react';
import { indexesRefContext } from './../contexts/MoviesDataProvider';
import { useContext } from 'react';

const useRowIndex = () => {
  const indexesRef = useContext(indexesRefContext)
  const [ rowIndex, setRowIndex ] = useState(indexesRef.current.rowIndex);

  useEffect(() => { indexesRef.current.rowIndex = rowIndex }, [rowIndex])
  
  return [ rowIndex, setRowIndex ] as [ typeof rowIndex, typeof setRowIndex ]
}

export default useRowIndex