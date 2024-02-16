import { Icon } from "@iconify-icon/react"

import { clientCookie } from "~/utils/helpers"
import { Theme } from "~/types/theme"

export default function ToggleThemeButton({
  theme = Theme.Light,
  onThemeChanged = (_: string) => {}
}) {
  const onSwitchChange = (isLight: boolean) => {
    const newTheme = isLight ? Theme.Dark : Theme.Light // Toggle theme
    document.cookie = clientCookie.stringify("theme", newTheme, { httpOnly: false })
    document.documentElement.classList.remove(Theme.Light, Theme.Dark)
    document.documentElement.classList.add(newTheme)
    onThemeChanged(newTheme)
  }

  return (
    <button
      className="w-10 h-4 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
      onClick={() => onSwitchChange(theme === Theme.Light)}
    >
      <div
        className={`w-8 h-8 relative flex items-center justify-center rounded-full transition duration-500 transform ${
          theme === Theme.Dark
            ? "bg-gray-700 translate-x-4"
            : "bg-sky-500 -translate-x-2"
        } p-1 text-white`}
      >
        {theme === Theme.Dark ? (
          <Icon icon="line-md:moon-loop" className=" text-yellow-200" />
        ) : (
          <Icon icon="line-md:sun-rising-loop" className=" text-amber-300" />
        )}
      </div>
    </button>
  )
}
