import React, { useState } from "react"
import { Icon } from "@iconify-icon/react"

import { Input as JLInput } from "~/components/ui/input"

interface CustomInputProps {
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string // Optional type prop
  variant?: "standalone" | "group" | "prefix" // Optional variant prop
  isError?: boolean // Optional isError prop
  errorText?: string // Optional errorText prop
  prefix?: React.ReactNode
  [key: string]: any // Additional props
}

export default function Input({
  className = "",
  onChange,
  variant = "standalone",
  isError,
  errorText,
  prefix,
  type = "text", // Default type is text
  ...otherProps
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : type

  // Flatten the edge that joins a sibling control (e.g. the Hero shorten
  // field sits flush against the submit button → "group" drops the right
  // radius; "prefix" drops the left radius). Tailwind utilities load after
  // the JLDS bundle so they win on equal specificity.
  const wrapClass = [
    variant === "group" ? "rounded-r-none" : "",
    variant === "prefix" ? "rounded-l-none" : "",
    className
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="flex w-full flex-col">
      <JLInput
        type={inputType}
        onChange={onChange}
        invalid={isError}
        icon={prefix}
        className={wrapClass}
        trailing={
          isPassword ? (
            <button
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              onClick={() => setIsPasswordVisible((v) => !v)}
              type="button"
              className="flex items-center"
            >
              <Icon
                icon={
                  isPasswordVisible ? "mdi:eye-off-outline" : "mdi:eye-outline"
                }
              />
            </button>
          ) : undefined
        }
        {...otherProps}
      />

      {isError && errorText ? (
        <div className="mt-1 flex items-center text-left">
          <Icon icon="line-md:alert-circle" className="mr-1 text-red-500" />
          <p className="text-sm text-red-500">{errorText}</p>
        </div>
      ) : null}
    </div>
  )
}
