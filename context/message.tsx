import React, { useContext } from "react"

import { Message,MessageProps } from "@/components/message"

export const MessageContext = React.createContext<Context>({
  showMessage: () => {},
})

export const MessageProvider = ({ children }: UserContextProvider) => {
  const [message, showMessage] = React.useState<Message | null>(null)

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      showMessage(null)
    }, 7000)
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [message])

  return (
    <MessageContext.Provider
      value={{
        showMessage,
      }}
    >
      {message ? <Message {...message} onClose={() => showMessage(null)}/> : null}
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  return useContext(MessageContext)
}

type UserContextProvider = {
  children: React.ReactNode
}

type Context = {
  showMessage: (message: Message) => void
}

type Message = Omit<MessageProps, 'onClose'>