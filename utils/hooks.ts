import { useRouter } from "next/router"
import * as React from "react"
import { debounce } from "debounce";

import { TOKEN_KEY } from "@/utils/const"

export function useUnauthorizedRedirect(url: string = "/login") {
  const router = useRouter()

  React.useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push(url)
    }
  }, [router, url])
}

export function useScrollIsBottom(callback: () => void) {
  const ref = React.useRef<HTMLDivElement>(null)

  const scrollHandler = debounce(() => {
    const refElRect = ref.current?.getBoundingClientRect()
    if (!refElRect) return

    if (refElRect.bottom <= window.innerHeight) {
      callback()
    }
  }, 200)

  React.useEffect(() => {
    document.addEventListener("scroll", scrollHandler)
    return () => {
      document.removeEventListener("scroll", scrollHandler)
    }
  }, [scrollHandler])

  return ref
}
