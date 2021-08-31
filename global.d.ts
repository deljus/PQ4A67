type HTTPError = {
    message: string;
}

type CreateCategoryRequest = {
    name: string;
    description: string;
}

type DeleteCategoryRequest = {
    categoryId: number;
}

type ClientSearchParams = {
    userName: string
    order: "desc" | "asc",
    name: string
    skip: number;
    take: number;
}

type ServerSearchParams = {
    skip: string;
    take: string;
} & ClientSearchParams;

type GetCategoryRequest = {} & ClientSearchParams;

type GetPostsByCategoryRequest = {} & ClientSearchParams;

type CreatePostRequest = {
    categoryId: string;
    image?: string;
    text?: string;
}

type DeletePostRequest = {
    categoryId: string;
    postId: number;
}