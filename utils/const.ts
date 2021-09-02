export const SERVER_STATUS = {
  UNAUTHORIZED: 403,
  SUCCESS: 200,
  BAD_REQUEST: 400,
} as const

export const TOKEN_KEY = "token"

export const PAGES = {
  INDEX: "/",
  LOGIN: "/login",
  QUOTES: "/category",
}

export const PAGE_ITEMS_COUNT = {
  CATEGORY: 12,
  POSTS: 12,
} as const

export const QUERY_KEYS = {
  CATEGORY: "CATEGORY",
  CREATE_CATEGORY: "CREATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  POSTS: "POSTS",
  CREATE_POST: "CREATE_POST",
  DELETE_POST: "DELETE_POST",
} as const

export const RANDOM_DELAY = [
  { id: 1, name: "Отключен", value: 0 },
  { id: 2, name: "1 День", value: 1 },
  { id: 3, name: "3 Дня", value: 3 },
  { id: 4, name: "7 Дней", value: 7 },
];

export const RESTRICTIONS = {
  CATEGORY_CREATE_COUNT: 5
} as const;
