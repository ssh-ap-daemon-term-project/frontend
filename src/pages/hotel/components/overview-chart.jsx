"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    date: "Jan 1",
    available: 45,
    booked: 75,
  },
  {
    date: "Jan 2",
    available: 40,
    booked: 80,
  },
  {
    date: "Jan 3",
    available: 35,
    booked: 85,
  },
  {
    date: "Jan 4",
    available: 30,
    booked: 90,
  },
  {
    date: "Jan 5",
    available: 25,
    booked: 95,
  },
  {
    date: "Jan 6",
    available: 20,
    booked: 100,
  },
  {
    date: "Jan 7",
    available: 15,
    booked: 105,
  },
  {
    date: "Jan 8",
    available: 10,
    booked: 110,
  },
  {
    date: "Jan 9",
    available: 5,
    booked: 115,
  },
  {
    date: "Jan 10",
    available: 0,
    booked: 120,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="available" fill="#16a34a" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="booked" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}

