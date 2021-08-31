import * as React from "react"

import { NavigationBar } from "@/components/navigation-bar"
import navigations from "@/data/navigation.json"

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-full flex-col">
      <NavigationBar sections={navigations} />
      {children}
    </div>
  )
}

type LayoutProps = {
  children: React.ReactNode
}