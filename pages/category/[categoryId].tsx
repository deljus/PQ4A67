import { TrashIcon } from "@heroicons/react/solid"
import { Post } from "@prisma/client"
import { debounce } from "debounce"
import { useRouter } from "next/router"
import * as React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "react-query"

import { Layout } from "@/components/layout"
import { EmptyBox } from "@/components/lib"
import { Loader } from "@/components/loader"
import { TYPES } from "@/components/message"
import { SortBar } from "@/components/sort-bar"
import { useMessage } from "@/context/message"
import { useUser } from "@/context/user"
import {
  createPost,
  deletePost,
  getPostsByCategory,
  GetPostsByCategoryResponse,
} from "@/utils/api"
import { PAGE_ITEMS_COUNT, QUERY_KEYS, RANDOM_DELAY } from "@/utils/const"
import { useScrollIsBottom } from "@/utils/hooks"

const qKeyGen = ({ userName, name, order }: ClientSearchParams, createKey: string) => ({
  userName,
  name,
  order,
  createKey,
})

export default function PostsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const router = useRouter()
  const { categoryId } = router.query as RouterQuery
  console.log(categoryId)
  const user = useUser()
  const { showMessage } = useMessage()
  const [createKey, setCreateKey] = React.useState("")
  const [searchParams, setSearchParams] = React.useState<ClientSearchParams>({
    userName: "",
    order: "desc",
    name: "",
    skip: 0,
    take: PAGE_ITEMS_COUNT.POSTS,
  })

  const queryClient = useQueryClient()

  const post = {
    all: useInfiniteQuery<GetPostsByCategoryResponse, HTTPError>(
      [QUERY_KEYS.POSTS, qKeyGen(searchParams, createKey)],
      () => getPostsByCategory(categoryId, searchParams),
      {
        getNextPageParam: (_, allPages) => {
          const count = allPages.map((page) => page.length).reduce((acc, count) => acc + count, 0)
          return count === searchParams.take + searchParams.skip
        },
        enabled: !!categoryId
      }
    ),
    create: useMutation<Post, HTTPError, CreatePostRequest, GetPostsByCategoryResponse>(
      QUERY_KEYS.CREATE_POST,
      createPost,
      {
        onSuccess: ({ text, image }) => {
          setSearchParams({ ...searchParams, skip: 0 })
          setCreateKey(`${text}-${image}`)
        },
      }
    ),
    del: useMutation<Post, HTTPError, DeletePostRequest, InfiniteData<GetPostsByCategoryResponse>>(
      QUERY_KEYS.DELETE_POST,
      deletePost,
      {
        // @ts-ignore
        onMutate: async (query) => {
          const requestKey = qKeyGen(searchParams, createKey)
          await queryClient.cancelQueries([QUERY_KEYS.POSTS, requestKey])

          const prev = queryClient.getQueryData([QUERY_KEYS.POSTS, requestKey]) as InfiniteData<
            Post[]
          >

          queryClient.setQueryData([QUERY_KEYS.POSTS, requestKey], {
            ...prev,
            pages: prev.pages.map((page) => page.filter(({ postId }) => postId !== query.postId)),
          })

          return prev
        },
        onError: (_, __, context) => {
          if (context) {
            const requestKey = qKeyGen(searchParams, createKey)
            queryClient.setQueryData([QUERY_KEYS.POSTS, requestKey], context)
          }
        },
      }
    ),
  }

  const scrolledElRef = useScrollIsBottom(() => {
    const { skip, take } = searchParams
    if (post.all.hasNextPage) {
      setSearchParams({ ...searchParams, skip: skip + take })
      post.all.fetchNextPage()
    }
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    post.create.mutate({ categoryId, ...data })
    reset()
  }

  const handleChange = debounce(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSearchParams({
        ...searchParams,
        skip: 0,
        [target.name]: target.value,
      })
    },
    200
  )

  const err = post.all.error || post.create.error || post.del.error

  React.useEffect(() => {
    if (err?.message) {
      showMessage({
        type: TYPES.ERROR,
        text: err.message,
      })
    }
  }, [err, showMessage])

  const isEmptyData = !post.all.data?.pages[0].length && !post.all.isLoading

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        <h1 className="mb-8">Посты</h1>
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <form
            className="border border-gray-200 rounded-md px-4 pb-4 pt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <small className="text-gray-600">Создать новую запись:</small>
            <label className="block relative w-full">
              <div className="flex flex-row justify-center items-center space-x-4">
                <input type="text" {...register("image")} placeholder="Ссылка на изображение" />
                <input type="text" {...register("text")} placeholder="текст" />
                <button type="submit" className="mt-1">
                  Создать
                </button>
              </div>
            </label>
          </form>
          <SortBar {...searchParams} onChange={handleChange} />
        </div>

        {post.all.isLoading ? <Loader /> : null}
        {isEmptyData ? <EmptyBox /> : null}
        <div
          ref={scrolledElRef}
          className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {post.all.data?.pages.map((page, i) => (
            <React.Fragment key={`pages-${i}`}>
              {page.map(({ postId, image, text, User, userId }) => {
                const isOwner = userId === user.data?.userId
                return (
                  <div
                    key={`post-${postId}`}
                    className="shadow-lg hover:shadow-xl  rounded justify-end overflow-hidden bg-white flex flex-col"
                  >
                    {image ? (
                      <div className="max-h-40 overflow-y-hidden">
                        <img className="w-full" src={image} alt="Mountain" />
                      </div>
                    ) : null}

                    <div className="px-6 py-4">
                      <p className="text-gray-700 text-base">{text}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-gray-400 text-base">{User.userName}</p>
                    </div>
                    <div className="px-6 py-6 flex justify-end">
                      <TrashIcon
                        className={`w-4 h-4 ${
                          isOwner
                            ? "cursor-pointer text-red-500"
                            : "text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => (isOwner ? post.del.mutate({ categoryId, postId }) : null)}
                      />
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
        {post.all.isFetchingNextPage ? (
          <div className="flex w-full animate-pulse mb-8">Загружаем...</div>
        ) : null}
      </div>
    </Layout>
  )
}

type Inputs = {
  text?: string
  image?: string
}

type RouterQuery = {
  categoryId: string
}
