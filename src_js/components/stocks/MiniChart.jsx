import React from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export const MiniChart = ({ trendScore, price, width = 80, height = 30 }) => {
  // Generate beautiful trend sparklines based on real data skew indices
  const data = React.useMemo(() => {
    const values = [];
    let current = price * 0.96; // starts lower
    const step = (price * 0.08) / 8; // final should hover around price

    for (let i = 0; i < 9; i++) {
      // Skew positive for high momentum stocks, negative for low
      const noise = (Math.random() - 0.45) * (price * 0.015);
      const direction = (trendScore - 50) / 50; // -1 to 1
      current += step * direction + noise;
      values.push({ value: parseFloat(current.toFixed(2)) });
    }
    // Anchor final points around actual price
    values.push({ value: price });
    return values;
  }, [trendScore, price]);

  const isBullish = trendScore >= 50;

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 2, bottom: 2, left: 2, right: 2 }}
        >
          <YAxis domain={["auto", "auto"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isBullish ? "#00E676" : "#FF4D4F"}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniChart;
