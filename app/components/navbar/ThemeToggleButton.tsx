import { Icon } from "@iconify-icon/react"

import { clientCookie } from "~/utils/helpers"
import { Theme } from "~/types/theme"
import { Switch } from "~/components/ui/switch"

export default function ToggleThemeButton({
  theme = Theme.Light,
  onThemeChanged = (_: string) => {}
}) {
  const isDark = theme === Theme.Dark

  const onSwitchChange = () => {
    const newTheme = isDark ? Theme.Light : Theme.Dark // Toggle theme
    document.cookie = clientCookie.stringify("theme", newTheme, {
      httpOnly: false
    })
    document.documentElement.classList.remove(Theme.Light, Theme.Dark)
    document.documentElement.classList.add(newTheme)
    // Keep JLDS tokens ([data-theme="dark"]) in sync with the Tailwind class.
    document.documentElement.setAttribute("data-theme", newTheme)
    onThemeChanged(newTheme)
  }

  return (
    <div className="flex items-center gap-2">
      <Icon
        icon="line-md:sun-rising-loop"
        className={isDark ? "text-gray-500" : "text-amber-400"}
      />
      <Switch
        checked={isDark}
        onChange={onSwitchChange}
        aria-label="Toggle dark mode"
      />
      <Icon
        icon="line-md:moon-loop"
        className={isDark ? "text-sky-300" : "text-gray-400"}
      />
    </div>
  )
}
