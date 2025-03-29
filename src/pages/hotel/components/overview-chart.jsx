"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import { hotelAvailabilityChart } from "@/api/hotel"
export function Overview() {
  // Move state inside the component
  const [availabilityChart, setAvailabilityChart] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await hotelAvailabilityChart();
        if (!response.ok) {
          setAvailabilityChart(null);
        } else {
          setAvailabilityChart(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {availabilityChart ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={availabilityChart}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="available" fill="#16a34a" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="booked" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        "No Data Available..."
      )}
    </>
  );
}