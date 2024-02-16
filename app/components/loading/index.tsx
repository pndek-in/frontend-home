import { useNavigation } from "@remix-run/react"
import LoadingBar from "react-top-loading-bar"
import { useEffect, useState } from "react"

export default function GlobalLoading() {
  const navigation = useNavigation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (navigation.state !== "idle") {
      setProgress(10) // Initial progress when loading starts
      intervalId = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress < 100 ? prevProgress + 10 : prevProgress
        )
      }, 100)
    } else {
      setProgress(100) // Complete the progress when loading finishes
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [navigation.state])

  return (
    <LoadingBar
      color="#F11946"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  )
}
