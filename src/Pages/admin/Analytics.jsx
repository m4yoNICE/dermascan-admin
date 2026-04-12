import React, { use } from 'react'
import { Line, Pie, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from 'react-redux';
import { fetchSkinTypes } from '../../redux/slices/skinTypeSlice.js';
import Api from '../../services/Api.js';
 
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);



export default function analytics() {
 const dispatch = useDispatch();
  const skinTypes = useSelector((state) => state.skinType.skinTypes);

  const [Oily, setOily] = useState(0);
  const [Dry, setDry] = useState(0);
  const [Combination, setCombination] = useState(0);
  const [Normal, setNormal] = useState(0);

  const [scanData, setScanData] = useState([]);
  const [scanLabels, setScanLabels] = useState([]);

  useEffect(() => {
    dispatch(fetchSkinTypes());
  }, [dispatch]);

  useEffect(() => {
    let oilyCount = 0;
    let dryCount = 0;
    let combinationCount = 0;
    let normalCount = 0;

    skinTypes.forEach((user) => {
      switch (user.skinType.toLowerCase()) {
        case "oily":
          oilyCount++;
          break;
        case "dry":
          dryCount++;
          break;
        case "combination":
          combinationCount++;
          break;
        case "normal":
          normalCount++;
          break;
      }
    });

    setOily(oilyCount);
    setDry(dryCount);
    setCombination(combinationCount);
    setNormal(normalCount);
  }, [skinTypes]);

  useEffect(() => {
  const fetchScanPerDay = async () => {
    try {
      const res = await Api.fetchScanPerDay();

      const labels = res.data.map(item => item.date);
      const counts = res.data.map(item => Number(item.count));

      setScanLabels(labels);
      setScanData(counts);

    } catch (error) {
      console.error("Error fetching scans per day:", error);
    }
  };

  fetchScanPerDay();
}, []);
  return (
      <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">Daily Scan Activity</h3>
  
  <div className="h-48">  {/* shrink chart height here */}
    <Line
      data={{
        labels: scanLabels,
        datasets: [
          {
            label: "Scans per Day",
            data: scanData,
            borderWidth: 2,
          },
        ],
      }}
      options={{ maintainAspectRatio: false }}
    />
  </div>

{/* Pie Chart Example */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-xl font-bold mb-4">Skin Type Distribution</h3>

    <div className="h-48">
      <Pie
        data={{
          labels: ["Oily", "Dry", "Combination", "Normal"],
          datasets: [
            {
              data: [Oily, Dry, Combination, Normal],
            },
          ],
        }}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  </div>
</div>
  )
}
