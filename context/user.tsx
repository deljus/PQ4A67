import { User } from "@prisma/client"
import React, { useContext } from "react"
import { useQuery } from "react-query"

import { getUser } from "@/utils/api"

export const UserContext = React.createContext<Context>({
  data: null,
  fetch: () => {},
  clean: () => {},
  isLoading: false,
})

export const UserContextProvider = ({ children }: UserContextProvider) => {
  const [user, setUser] = React.useState<User | null>(null)
  const { isLoading, data, refetch, isSuccess } = useQuery("user", getUser, { retry: false })

  React.useEffect(() => {
    if (isSuccess && data) {
      setUser(data)
    }
  }, [data, isSuccess])

  return (
    <UserContext.Provider
      value={{
        fetch: refetch,
        clean: () => setUser(null),
        data: user,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}

type UserContextProvider = {
  children: React.ReactNode
}

type Context = {
  fetch: () => void
  clean: () => void
  isLoading: boolean
  data: User | null
}