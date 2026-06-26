import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

import { Card } from "~/components/ui/card"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type DashboardTotalVisitorProps = {
  label: string
  labels: string[]
  data: number[]
  title: string
  isVerified: boolean
}

export default function DashboardTotalVisitor({
  label,
  labels,
  data,
  title,
  isVerified
}: DashboardTotalVisitorProps) {
  // Resolve the themed accent color from CSS tokens so the chart flips with
  // light/dark. Falls back to JLDS emerald before hydration.
  const [accent, setAccent] = useState("#10b981")
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const value = styles.getPropertyValue("--accent").trim()
    if (value) setAccent(value)
  }, [])

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: accent,
        backgroundColor: `${accent}1a`,
        pointBackgroundColor: accent,
        fill: true,
        tension: 0.35
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <Card elevation="raised">
      <Card.Header title={title} />
      <Card.Body className="pt-0">
        <div className={isVerified ? "" : "select-none blur-sm"}>
          <Line options={options} data={chartData} />
        </div>
      </Card.Body>
    </Card>
  )
}
