import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import useBlockScrolling from '../hooks/useBlockScrolling'
import { ModalContainerProps } from '../types/props'

const ModalContainerElement = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.modalContainer.background};
  backdrop-filter: blur(4px);
  display: flex;
  padding: 30px;
  justify-content: center;
  align-items: center;
  opacity: inherit;
  overflow: hidden;

  z-index: 1000;
`

const ModalContainer = ({ children, handleClose } : ModalContainerProps) => {
  useBlockScrolling()

  return (
    <ModalContainerElement
      onClick={handleClose}
    >{ children }</ModalContainerElement>
  )
}

export default ModalContainer