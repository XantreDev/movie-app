import { styleContext } from './../contexts/StyleProvider';
import React, { useContext } from 'react'

const useStyleContext = () => useContext(styleContext)

export default useStyleContext