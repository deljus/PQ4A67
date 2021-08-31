import type { NextPage } from "next"

import { Layout } from "@/components/layout"
import { useUser } from "@/context/user"

const Home: NextPage = () => {
  const user = useUser()

  if (!user.data) return null

  return (
    <Layout>
      <div className="container flex mx-auto h-full justify-center items-center">
        <div className="space-y-4">
          <h1>
            Привет <span className="text-red-500">{user.data.userName}</span>!
          </h1>
          <h1>Ты находишься внутри бота {process.env.NEXT_PUBLIC_BOT_NAME}!</h1>
          <p>Здесь ты можешь поиграться со мной</p>
        </div>
      </div>
    </Layout>
  )
}

export default Home
