import { useState, useEffect } from "react"
import { numberHelper } from "~/utils/helpers"

type CounterProps = {
  total: number
}

const Counter = ({ total }: CounterProps) => {
  const [count, setCount] = useState(0)
  const speed = 1000 // number of ms it should take to count from 0 to total

  useEffect(() => {
    let isMounted = true // flag to handle component unmount

    const animate = () => {
      const time = total / speed
      if (count < total && isMounted) {
        setCount((prevCount) => Math.min(total, Math.ceil(prevCount + time)))
      }
    }

    const timer = setInterval(animate, 1)

    // Cleanup on unmount
    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [total, count])

  return <>{numberHelper.formatNumber(count)}</>
}

export default Counter
