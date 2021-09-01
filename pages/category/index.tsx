import { TrashIcon } from "@heroicons/react/solid"
import { Category } from "@prisma/client"
import { debounce } from "debounce"
import * as React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "react-query"

import { Layout } from "@/components/layout"
import { EmptyBox,Link } from "@/components/lib"
import { Loader } from "@/components/loader"
import { TYPES } from "@/components/message"
import { SelectButton } from "@/components/select-button"
import { SortBar } from "@/components/sort-bar"
import { useMessage } from "@/context/message"
import { useUser } from "@/context/user"
import {
  createCategory,
  deleteCategory,
  GetAllCategoriesResponse,
  getCategories,
} from "@/utils/api"
import { PAGE_ITEMS_COUNT, QUERY_KEYS, RANDOM_DELAY } from "@/utils/const"
import { useScrollIsBottom } from "@/utils/hooks"

const qKeyGen = ({ userName, name, order }: ClientSearchParams, createKey: string) => ({
  userName,
  name,
  order,
  createKey,
})

export default function QuotesPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const user = useUser()
  const { showMessage } = useMessage()
  const [createKey, setCreateKey] = React.useState("")
  const [searchParams, setSearchParams] = React.useState<ClientSearchParams>({
    userName: "",
    order: "desc",
    name: "",
    skip: 0,
    take: PAGE_ITEMS_COUNT.CATEGORY,
  })

  const queryClient = useQueryClient()

  const category = {
    all: useInfiniteQuery<GetAllCategoriesResponse, HTTPError>(
      [QUERY_KEYS.CATEGORY, qKeyGen(searchParams, createKey)],
      () => getCategories(searchParams),
      {
        getNextPageParam: (_, allPages) => {
          const count = allPages.map((page) => page.length).reduce((acc, count) => acc + count, 0)
          return count === searchParams.take + searchParams.skip
        },
      }
    ),
    create: useMutation<Category, HTTPError, CreateCategoryRequest, GetAllCategoriesResponse>(
      QUERY_KEYS.CREATE_CATEGORY,
      createCategory,
      {
        onSuccess: ({ categoryId }) => {
          setSearchParams({ ...searchParams, skip: 0 })
          setCreateKey(String(categoryId))
        },
      }
    ),
    del: useMutation<
      Category,
      HTTPError,
      DeleteCategoryRequest,
      InfiniteData<GetAllCategoriesResponse>
    >(QUERY_KEYS.DELETE_CATEGORY, deleteCategory, {
      // @ts-ignore
      onMutate: async (query) => {
        const requestKey = qKeyGen(searchParams, createKey)
        await queryClient.cancelQueries([QUERY_KEYS.CATEGORY, requestKey])

        const prev = queryClient.getQueryData([QUERY_KEYS.CATEGORY, requestKey]) as InfiniteData<
          Category[]
        >

        queryClient.setQueryData([QUERY_KEYS.CATEGORY, requestKey], {
          ...prev,
          pages: prev.pages.map((page) =>
            page.filter(({ categoryId }) => categoryId !== query.categoryId)
          ),
        })

        return prev
      },
      onError: (_, __, context) => {
        if (context) {
          const requestKey = qKeyGen(searchParams, createKey)
          queryClient.setQueryData([QUERY_KEYS.CATEGORY, requestKey], context)
        }
      },
    }),
  }

  const scrolledElRef = useScrollIsBottom(() => {
    const { skip, take } = searchParams
    if (category.all.hasNextPage) {
      setSearchParams({ ...searchParams, skip: skip + take })
      category.all.fetchNextPage()
    }
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    category.create.mutate(data)
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

  const err = category.all.error || category.create.error || category.del.error || errors.name

  React.useEffect(() => {
    if (err?.message) {
      showMessage({
        type: TYPES.ERROR,
        text: err.message,
      })
    }
  }, [err, showMessage])

  const isEmptyData = !category.all.data?.pages[0].length && !category.all.isLoading

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8">
        <h1 className="mb-8">Категории</h1>
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <form
            className="border border-gray-200 rounded-md px-4 pb-4 pt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <small className="text-gray-600">Создать новую категорию:</small>
            <label className="block relative w-full">
              <div className="flex flex-row justify-center items-center space-x-4">
                <span className="text-gray-500">/pq</span>
                <input
                  type="text"
                  {...register("name", { required: "Поле категории не может быть пустым" })}
                  placeholder="команда для бота"
                />
                <input type="text" {...register("description")} placeholder="Описание" />
                <button type="submit" className="mt-1">
                  Создать
                </button>
              </div>
            </label>
          </form>
          <SortBar {...searchParams} onChange={handleChange} />
        </div>

        {category.all.isLoading ? <Loader /> : null}
        {isEmptyData ? <EmptyBox /> : null}
        <div
          ref={scrolledElRef}
          className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {category.all.data?.pages.map((page, i) => (
            <React.Fragment key={`pages-${i}`}>
              {page.map(({ categoryId, name, User, userId, description, randomDelay }) => {
                const isOwner = userId === user.data?.userId
                return (
                  <div
                    key={`category-${categoryId}`}
                    className={`flex flex-col p-6 space-x-6 bg-white rounded-md shadow-lg hover:shadow-xl transform justify-between border ${
                      userId === user.data?.userId ? "border-purple-600" : ""
                    }`}
                  >
                    <div className="flex items-start flex-col space-y-4">
                      <Link href={`/category/${categoryId}`}>/pq{name}</Link>
                      <span className="text-gray-700">Автор: {User.userName}</span>
                      <span className="text-gray-700">Описание: {description}</span>
                      {isOwner ? (
                        <div>
                          <span className="text-gray-700 mr-8">Время действия рандома:</span>
                          <SelectButton
                            items={RANDOM_DELAY}
                            defaultValue={randomDelay}
                            disabled={isOwner}
                          />
                        </div>
                      ) : null}
                    </div>
                    {isOwner ? (
                      <div className="mt-8 flex justify-end">
                        <TrashIcon
                          className="w-4 h-4 text-red-500 cursor-pointer"
                          onClick={() => category.del.mutate({ categoryId })}
                        />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
        {category.all.isFetchingNextPage ? (
          <div className="flex w-full animate-pulse mb-8">Загружаем...</div>
        ) : null}
      </div>
    </Layout>
  )
}

type Inputs = {
  name: string
  description: string
}
