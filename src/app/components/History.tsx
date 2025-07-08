import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("serp_history");
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  return (
    <div className="mt-4">
      <h5>Geçmiş Sorgular:</h5>
      {history.length === 0 ? (
        <p>Henüz sorgu yapılmadı.</p>
      ) : (
        <ul className="list-group">
          {history.map((item, i) => (
            <li className="list-group-item" key={i}>
              {new Date(item.date).toLocaleString()} — {item.result.keyword}{" "}
              <br />
              Organik: #{item.result.position ?? "Yok"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
