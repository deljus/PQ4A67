import { Category, Post,User } from "@prisma/client"
import ky from "ky-universal"

import { PAGES, SERVER_STATUS, TOKEN_KEY } from "@/utils/const"

export const api = ky.create({
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) request.headers.set("Authorization", token)
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === SERVER_STATUS.UNAUTHORIZED) {
          localStorage.removeItem(TOKEN_KEY)
          if(window.location.pathname !== PAGES.LOGIN) {
            window.location.pathname = PAGES.LOGIN
          }
        }

        if (!response.ok) {
          throw await response.json()
        }
      },
    ],
  },
})

export function getUser() {
  return api.get("/api/user").json<User>()
}

export function getCategories(searchParams: GetCategoryRequest) {
  return api.get("/api/category", { searchParams }).json<GetAllCategoriesResponse>()
}

export function createCategory(json: CreateCategoryRequest) {
  return api.put("/api/category", { json }).json<Category>()
}

export function deleteCategory(json: DeleteCategoryRequest) {
  return api.delete("/api/category", { json }).json<Category>()
}

export function getPostsByCategory(categoryId: string, searchParams: GetPostsByCategoryRequest) {
  return api.get(`/api/category/${categoryId}`, { searchParams }).json<GetPostsByCategoryResponse>()
}

export function createPost({ categoryId, ...json }: CreatePostRequest) {
  return api.put(`/api/category/${categoryId}`, { json }).json<Post>()
}

export function deletePost({ categoryId, ...json }: DeletePostRequest) {
  return api.delete(`/api/category/${categoryId}`, { json }).json<Post>()
}

type ServerCategory = {
  User: Pick<User, 'userName'>
} & Category;

type PostByCategory = {
  User: Pick<User, 'userName'>
} & Post;

export type GetAllCategoriesResponse = Array<ServerCategory>;

export type GetPostsByCategoryResponse = Array<PostByCategory>;

