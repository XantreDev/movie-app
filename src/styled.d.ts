import { Styles } from './contexts/StyleProvider';
import 'styled-components'

type StylesType = typeof Styles

declare module 'styled-components' {
  export interface DefaultTheme extends StylesType{}
}