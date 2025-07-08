"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface ResultItem {
  title: string;
  link: string;
  position: number;
}

interface RankingChartProps {
  results: ResultItem[];
  highlightDomain: string;
}

const RankingChart = ({ results, highlightDomain }: RankingChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const cleanedDomain = highlightDomain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase();

    const backgroundColors = results.map(
      (r) =>
        r.link.toLowerCase().includes(cleanedDomain)
          ? "rgba(255, 99, 132, 0.8)" // kırmızı
          : "rgba(75, 192, 192, 0.7)" // turkuaz
    );

    const borderColors = results.map((r) =>
      r.link.toLowerCase().includes(cleanedDomain)
        ? "rgba(255, 99, 132, 1)"
        : "rgba(75, 192, 192, 1)"
    );

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: results.map((r) =>
          r.title.length > 30 ? r.title.slice(0, 30) + "..." : r.title
        ),
        datasets: [
          {
            label: "Pozisyon",
            data: results.map((r) => r.position),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Pozisyon: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            reverse: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Pozisyon",
            },
          },
        },
      },
    });
  }, [results, highlightDomain]);

  return (
    <div className="card my-4">
      <div className="card-body">
        <h5 className="card-title">Organik Sonuçların Sıralaması</h5>
        <canvas ref={chartRef} height={300}></canvas>
      </div>
    </div>
  );
};

export default RankingChart;
