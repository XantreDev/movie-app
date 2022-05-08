import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import MoviesDataProvider from '../contexts/MoviesDataProvider'
import StyleProvider from '../contexts/StyleProvider'
import ModalProvider from './ModalProvider'
import NotificationsProvider from './NotificationsProvider'

const AllProviders = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <HelmetProvider>
        <StyleProvider>
          <ModalProvider>
            <NotificationsProvider>
              <MoviesDataProvider>
                {children}
              </MoviesDataProvider>
            </NotificationsProvider>
          </ModalProvider>
        </StyleProvider>
      </HelmetProvider>
  )
}

export default AllProviders