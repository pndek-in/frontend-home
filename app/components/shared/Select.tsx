import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify-icon/react"

type DropdownProps = {
  defaultValue?: string
  width?: string // tailwindcss width class
  onChange?: (value: string) => void
  options?: {
    label: string
    value: string
  }[]
}

function Dropdown({
  defaultValue = "",
  options = [],
  onChange
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleItemClick = (value: string) => {
    if (onChange) {
      onChange(value)
    }
    setIsDropdownOpen(false)
  }

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="inline-flex justify-between items-center pl-4 pr-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 min-w-32"
        onClick={toggleDropdown}
      >
        {defaultValue}
        <Icon
          icon={
            isDropdownOpen
              ? "line-md:chevron-up"
              : "line-md:chevron-down"
          }
          className="ml-2"
        />
      </button>

      {isDropdownOpen && (
        <div className="origin-top-left absolute left-0 mt-2 min-w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-2 p-2" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <div
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
                key={option.value}
                onClick={() => handleItemClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
