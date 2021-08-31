import { useRouter } from "next/router"
import * as React from "react"
import { SubmitHandler,useForm } from "react-hook-form"

import { useUser } from "@/context/user"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const user = useUser()
  const router = useRouter()
  const onSubmit: SubmitHandler<Inputs> = ({ token }) => {
    localStorage.setItem("token", token)
    user.fetch()
  }

  React.useEffect(() => {
    if (user.data) {
      router.push("/")
    }
  }, [router, user.data])

  return (
    <div className="w-full h-full">
      <form
        className="flex flex-col justify-center items-center h-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-start max-w-lg w-full space-x-4">
          <label className="block relative w-full">
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Токен..."
              {...register("token", { required: true })}
            />
            {errors.token && <small className="text-red-500">Токен не может быть пустым</small>}
          </label>
          <button type="submit" className="mt-1" disabled={user.isLoading}>
            Войти
          </button>
        </div>
      </form>
    </div>
  )
}

type Inputs = {
    token: string;
}

