import React, { useReducer } from 'react'
import { createPortal } from 'react-dom'
import { produce } from 'immer'
import { NotificationActions, NotificationState } from '../types/context'
import { createContext } from 'react'
import NotificationsList from './NotificationsList'


const initialState: NotificationState = []

const notificationReducer = (state = initialState, action: NotificationActions) => produce(state, (draft) => {
  switch (action.type){
    case 'append-notification': {
      draft.push(action.payload)
      break;
    }
    case 'remove-notification': {
      return draft.filter(value => value.id !== action.payload)
    }
  }
})

export const notificationContext = createContext({} as React.Dispatch<NotificationActions>)

const NotificationsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const element = document.querySelector('#notification-root')
  const [ state, dispatch ] = useReducer(notificationReducer, [])

  return (
    <notificationContext.Provider value={dispatch}>
      {createPortal(<NotificationsList data={state} />, element)}
      {children}
    </notificationContext.Provider>
  )
}

export default NotificationsProvider