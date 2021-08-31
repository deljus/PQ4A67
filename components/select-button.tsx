import * as React from "react"

export function SelectButton({ items, defaultValue, onChange, ...rest }: SelectButtonProps) {
  const defaultIndex = items.findIndex((item) => item.value === defaultValue)

  const [index, setIndex] = React.useState(defaultIndex)

  const handleChange = () => {
    let newIndex = index === items.length - 1 ? 0 : index + 1

    setIndex(newIndex)
    if (onChange) onChange(items[newIndex].value)
  }

  return (
    <button
      {...rest}
      className="bg-white hover:bg-white text-purple-600 border border-purple-600"
      onClick={handleChange}
    >
      {items[index].name}
    </button>
  )
}

type Item = {
  id: number
  name: string
  value: string | number
}

type SelectButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  items: Item[]
  defaultValue: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
}
