import React, { createContext, useState } from 'react'
import { ThemeProvider } from 'styled-components' 

export const Styles = {
  borderRadiuses: {
    default: `28px`,
    cardBadge: `10px`
  },
  colors: {
    background: 'hsla(0, 0%, 7%, 1)',
    tint: 'hsla(0, 0%, 16%, 1)',
    transparentText: 'hsla(0, 0%, 100%, 0.8)',
    text: 'hsla(0, 0%, 100%, .95)',
    textBright: 'hsla(0, 0%, 100%, 1)',
    accent: 'hsla(24, 95%, 58%, 1)',
    reviewCards: {
      good: "hsla(97, 20%, 16%, 1)",
      bad: "hsla(360, 20%, 16%, 1)",
      none: "hsla(0, 0%, 16%, 1)"
    },
    modalContainer: {
      background: "background: hsla(0, 0%, 0%, 0.3)",
    }
  },
  dimmensions: {
    searchHeight: 44,
    searchTopOffset: 40,
    searchCardsOffsetFromSearchBar: 76
  }
}

const StyleProvider = ({children}: React.PropsWithChildren<{}>) => {
  const [styles, setStyles] = useState(Styles)
  
  return (
    <ThemeProvider
      theme={styles}
    >
      {children}
    </ThemeProvider>
  )
}

export default StyleProvider