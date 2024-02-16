import { useState, useEffect } from "react"

type DashboardTopFiveProps = {
  labels: string[]
  title: string
  data: number[]
  columnTitle: string
}

export default function DashboardTopFive({
  labels,
  title,
  data,
  columnTitle
}: DashboardTopFiveProps) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className=" h-min bg-white rounded-md p-4 border shadow-md">
      <h2 className=" text-center font-semibold text-lg mb-4">{title}</h2>
      <table className=" h-min w-full">
        <thead className=" border">
          <tr>
            <th className="text-left px-3 py-2">{columnTitle}</th>
            <th className="text-left px-3 py-2">Jumlah</th>
          </tr>
        </thead>
        <tbody className="">
          {labels.map((label, index) => (
            <tr key={index} className=" border hover:bg-slate-300">
              <td className=" text-left px-3 py-2">{label}</td>
              <td className=" text-left px-3 py-2">{data[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
