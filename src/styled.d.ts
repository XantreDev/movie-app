import 'styled-components'

import { Styles } from './contexts/StyleProvider';

type StylesType = typeof Styles

declare module 'styled-components' {
  export interface DefaultTheme extends StylesType{}
}