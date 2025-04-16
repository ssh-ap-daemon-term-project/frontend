"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState, useEffect } from "react"
import { getRoomTypeDistribution } from "@/api/hotel" // Assuming this API function exists or needs to be created

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function RoomTypeDistribution() {
  const [roomTypeData, setRoomTypeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getRoomTypeDistribution();
        if (response.status === 200) {
          const data = response.data.map((item) => ({
            name: item.room_type,
            value: item.count,
          }));
          setRoomTypeData(data);
        }
      } catch (error) {
        console.error("Error fetching room type data:", error);
        toast.error("Error fetching room type data");
      }
    }

    fetchData();
  }, []);

  return (
    <div className="h-[300px] w-full">
      {roomTypeData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roomTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {roomTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">No Data Available...</div>
      )}
    </div>
  );
}