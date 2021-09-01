import { XIcon } from "@heroicons/react/solid"
import * as React from "react"

export const TYPES = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
}

export function Message({ type, text, onClose }: MessageProps) {
  return (
    <div className="absolute z-50 bottom-0 right-0 w-full max-w-full md:max-w-lg">
      <div
        className={`flex m-4 rounded-lg bg-white border-2 flex-row items-start space-x-4 p-8 ${
          type === TYPES.SUCCESS ? "border-green-500" : "border-red-500"
        }`}
      >
        <span>{type === TYPES.SUCCESS ? "😀" : "😥"}</span>
        <span className="w-full">{text}</span>
        <XIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
      </div>
    </div>
  )
}

export type MessageProps = {
  type: typeof TYPES[keyof typeof TYPES]
  text: string
  onClose: () => void
}
