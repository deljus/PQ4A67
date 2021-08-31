import "@/styles/globals.css"

import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

import { UserContextProvider } from "@/context/user"
import { MessageProvider } from "@/context/message"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <MessageProvider>
          <Component {...pageProps} />
        </MessageProvider>
      </UserContextProvider>
    </QueryClientProvider>
  )
}
export default MyApp
