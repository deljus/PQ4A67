import * as React from "react"

export function SortBar({ onChange }: SortBarProps) {
  return (
    <form className="border border-gray-200 rounded-md px-4 pb-4 pt-2">
      <small className="text-gray-600">Поиск и сортировка:</small>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <input name="name" type="text" placeholder="Текст" onChange={onChange} />
        <input name="userName" type="text" placeholder="Автор" onChange={onChange} />
        <select name="order" onChange={onChange}>
          <option value="asc">Возрастание</option>
          <option value="desc">Убывание</option>
        </select>
      </div>
    </form>
  )
}

export type SearchParams = {
  userName: string
  order: "desc" | "asc"
  name: string
}

export type SortBarProps = SearchParams & {
  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void
}
