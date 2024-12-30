import { useEffect, useState } from "react"

interface UseAds {
  id: string
}

export const useAds = ({ id }: UseAds) => {
  const [isAdShowing, setIsAdShowing] = useState(true)

  useEffect(() => {
    const adContainer = document.getElementById(id)

    if (adContainer) {
      const script1 = document.createElement("script")
      script1.type = "text/javascript"
      script1.innerHTML = `
        atOptions = {
          'key' : 'df3eb34f2b7e33dff4da68bf371418e5',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `
      adContainer.appendChild(script1)

      const script2 = document.createElement("script")
      script2.type = "text/javascript"
      script2.src =
        "//www.highperformanceformat.com/df3eb34f2b7e33dff4da68bf371418e5/invoke.js"
      adContainer.appendChild(script2)

      script2.onerror = () => {
        setIsAdShowing(false)
      }

      return () => {
        adContainer.innerHTML = ""
      }
    }
  }, [])

  return { isAdShowing }
}
