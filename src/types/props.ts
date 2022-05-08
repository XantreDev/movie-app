import { NotificationState } from './context';
import { MovieDetailsRest, ReviewsResult } from './movieDetails';
export type IconProps = React.SVGProps<SVGSVGElement>

export type ActorsListProps = {
  data: MovieDetailsRest
}

export type NotificationListProps = {
  data: NotificationState
}


type ModalProps = {
  handleClose: () => void
}

export type ReviewModalProps = {
  review: ReviewsResult
} & ModalProps

export type ModalContainerProps = React.PropsWithChildren<{ handleClose: () => void }>