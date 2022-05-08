import { useRef } from 'react';
import React, { useEffect } from 'react'

const useBlockScrolling = (selector = '') => {
  useEffect(() => {
    const element = selector ? document.querySelector(selector) as HTMLElement : document.body
    const elementOverflow = element.style.overflow
    
    element.style.overflow = "hidden"
    return () => {
      element.style.overflow = elementOverflow
    }
  }, [])
}

export default useBlockScrolling