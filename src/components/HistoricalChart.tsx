import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface IHistoricalChartProps {
  currency: string;
}
const HistoricalChart: React.FC<IHistoricalChartProps> = ({ currency }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${currency}/history?apikey=33E76C4F-9B5C-49BD-BE77-FFFBE2FD8395&period_id=1DAY&time_start=2023-05-01T00:00:00&limit=360`,
        );

        const chartData = {
          labels: data.map((entry: any) =>
            new Date(entry.time_period_end).toLocaleDateString(),
          ),
          datasets: [
            {
              label: "Price",
              data: data.map((entry: any) => entry.price_close),
              fill: false,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
            },
          ],
        };
        setData(chartData);
      } catch (e) {
        console.error(e)
      }
    };

    fetchData();
  }, [currency]);

  return (
    <div style={{position: "relative", height: '80vh', width: '100%'}}>
      {data && <Line data={data} options={{responsive: true, maintainAspectRatio: true}} />}
    </div>
  );
};

export default HistoricalChart;
