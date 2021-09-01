import "@/styles/globals.css"

import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"

import { MessageProvider } from "@/context/message"
import { UserContextProvider } from "@/context/user"

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
