"use client";
import { useEffect, useState } from "react";

interface HistoryItem {
  date: string;
  result: {
    keyword: string;
    position: number | null;
  };
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("serp_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as HistoryItem[];
        setHistory(parsed);
      } catch (e) {
        console.error("Geçmiş verisi yüklenemedi:", e);
        setHistory([]);
      }
    }
  }, []);

  if (history.length === 0) {
    return <p className="mt-4">Henüz sorgu yapılmadı.</p>;
  }

  return (
    <div className="mt-4">
      <h5>Geçmiş Sorgular</h5>
      <ul className="list-group">
        {history.map((item, i) => (
          <li className="list-group-item" key={i}>
            {new Date(item.date).toLocaleString()} —{" "}
            <strong>{item.result.keyword}</strong> <br />
            Organik:{" "}
            {item.result.position ? (
              <span className="text-success">#{item.result.position}</span>
            ) : (
              <span className="text-danger">Yok</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
