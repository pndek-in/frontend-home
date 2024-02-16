import React, { useRef, useState } from "react"
import { Icon } from "@iconify-icon/react"

interface CustomInputProps {
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string // Optional type prop
  variant?: "standalone" | "group" | "prefix" // Optional variant prop
  isError?: boolean // Optional isError prop
  errorText?: string // Optional errorText prop
  [key: string]: any // Additional props
}

export default function Input({
  className = "",
  onChange,
  variant = "standalone",
  isError,
  errorText,
  type = "text", // Default type is text
  ...otherProps
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [inputType, setInputType] = useState(type)
  const inputRef = useRef<HTMLInputElement>(null) // Ref for the input element
  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)

    // Change the input type
    setInputType(isPasswordVisible ? "password" : "text")

    // Focus the input after state update
    inputRef.current?.focus()
  }

  const variants = {
    standalone: "rounded-lg border p-2",
    group: "rounded-l-lg border-b border-l border-t p-2",
    prefix: "rounded-r-lg border-b border-r border-t py-2 pr-2"
  }

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="relative flex group">
        {otherProps.prefix && (
          <div
            className={`flex items-center pl-3 rounded-l-lg border-t border-b border-l group-hover:border-blue-500 ${
              isError ? " border-red-500" : "border-gray-200"
            }`}
          >
            {otherProps.prefix}
          </div>
        )}
        <input
          ref={inputRef}
          type={inputType}
          onChange={onChange} // Include onChange to handle input changes
          className={`w-full border-t mr-0 text-gray-800 bg-white outline-none text-sm group-hover:border-blue-500 ${
            isError ? " border-red-500" : "border-gray-200"
          } ${variants[variant]}`}
          {...otherProps}
        />

        {type === "password" && (
          <button
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            onClick={togglePasswordVisibility}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
              icon={
                isPasswordVisible ? "mdi:eye-off-outline" : "mdi:eye-outline"
              }
              className="text-gray-500"
            />
          </button>
        )}
      </div>

      {isError && errorText ? (
        <div className=" flex items-center text-left">
          <Icon icon="line-md:alert-circle" className="text-red-500 mr-1" />
          <p className="text-red-500 text-sm">{errorText}</p>
        </div>
      ) : null}
    </div>
  )
}
