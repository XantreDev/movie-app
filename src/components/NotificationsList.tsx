import { AnimatePresence,motion } from 'framer-motion'
import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import styled from 'styled-components'

import { NotificationListProps } from '../types/props'
import { notificationContext } from './NotificationsProvider'

const Notification = styled(motion.article)`
  width: min(280px, 70vw);
  background-color: ${props => props.theme.colors.tint};
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 28px;
  padding: 30px 26px;
  border-radius: ${props => props.theme.borderRadiuses.default};
  border: .3px solid rgb(255 255 255 / .5);
  box-shadow: 0px 2px 10px rgb(255 255 255 / .2);
`

const NotificationsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  position: fixed;
  top: 40px;
  left: 40px;
  z-index: 100;
`

const NotificationsList = ({ data: notifications }: NotificationListProps) => {
  const dispatch = useContext(notificationContext)
  const removeRef = useRef<{id: number, timeoutId: number}[]>([])

  useEffect(() => {
    console.log(notifications)
    const allNotificationIds = new Set(notifications.map(value => value.id))
    removeRef.current = removeRef.current.filter(value => allNotificationIds.has(value.id))

    if (removeRef.current.length < allNotificationIds.size) {
      const oldNotificationIds = new Set(removeRef.current.map(value => value.id))
      notifications.forEach(value => {
        if (!oldNotificationIds.has(value.id)){
          removeRef.current.push({
            id: value.id,
            timeoutId: +setTimeout(() => dispatch({
              type: 'remove-notification',
              payload: value.id
            }), 1000 * value.duration)
          })
        }
      })
    }
  }, [notifications])

  return (
    <NotificationsContainer>
      <AnimatePresence>

      {notifications.map((value) => (
        <Notification 
          key={value.id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0, transition: { duration: .3 }}}
          transition={{ type: 'spring' }}
          >{value.text}</Notification>
        ))}
      </AnimatePresence>
    </NotificationsContainer>
  );
}

export default React.memo(NotificationsList)