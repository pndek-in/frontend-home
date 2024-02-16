import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type DashboardTotalVisitorProps = {
  label: string
  labels: string[]
  data: number[]
  title: string
}

export default function DashboardTotalVisitor({
  label,
  labels,
  data,
  title
}: DashboardTotalVisitorProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: "black",
        backgroundColor: "black"
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
    <div className=" bg-white p-4 rounded-md">
      <h2 className=" text-center font-semibold text-lg mb-4">{title}</h2>
      <Line options={options} data={chartData} />
    </div>
  )
}
