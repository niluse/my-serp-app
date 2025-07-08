"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import RankingChart from "./components/RankingChart";
import History from "./components/History";
import "bootstrap/dist/css/bootstrap.min.css";

interface Result {
  keyword: string;
  position: number | null;
  url: string | null;
}

interface ResultItem {
  title: string;
  link: string;
  position: number;
}

interface HistoryItem {
  date: string;
  result: {
    keyword: string;
    position: number | null;
  };
}

export default function Home() {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [allResults, setAllResults] = useState<ResultItem[]>([]);

  const handleSearch = async () => {
    if (!domain || !keyword) {
      setMessage({ text: "Lütfen tüm alanları doldurun.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setResult(null);

    try {
      const response = await axios.get("/api/serp", {
        params: {
          api_key: process.env.SERP_API_KEY,
          q: keyword,
          num: 50,
          hl: "tr",
          gl: "tr",
        },
      });

      const organic = response.data.organic_results || [];

      const cleanedDomain = domain
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .toLowerCase();

      const rankingResults: ResultItem[] = organic.map(
        (item: { title: string; link: string }, index: number) => ({
          title: item.title || `Sonuç ${index + 1}`,
          link: item.link,
          position: index + 1,
        })
      );

      setAllResults(rankingResults);

      const foundIndex = organic.findIndex((r: { link: string }) =>
        r.link.toLowerCase().includes(cleanedDomain)
      );

      const organicResult: Result = {
        keyword,
        position: foundIndex >= 0 ? foundIndex + 1 : null,
        url: foundIndex >= 0 ? organic[foundIndex].link : null,
      };

      setResult(organicResult);
      setMessage({ text: "Arama başarıyla yapıldı.", type: "success" });

      const newEntry = {
        date: new Date().toISOString(),
        result: organicResult,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("serp_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      setMessage({
        text: "Bir hata oluştu. Lütfen tekrar deneyin.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("serp_history") || "[]");
    setHistory(stored);
  }, []);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mb-4 text-center">🔍 SERP Sıralama Kontrol</h1>

      <div className="card w-100" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Domain</label>
            <input
              type="text"
              className="form-control"
              placeholder="örnek: example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Anahtar Kelime</label>
            <input
              type="text"
              className="form-control"
              placeholder="örnek: kahve makineleri"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary w-100"
            disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Aranıyor...
              </>
            ) : (
              "Sıralamayı Kontrol Et"
            )}
          </button>

          {message && (
            <div className={`alert mt-3 alert-${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-4 text-center">
          <h4>Sonuç:</h4>
          {result.position ? (
            <p>
              <strong>{result.keyword}</strong> için <strong>{domain}</strong>{" "}
              <br />
              <span className="text-success">
                Google&apos;da <strong>{result.position}.</strong> sırada!
              </span>
            </p>
          ) : (
            <p className="text-danger">Google ilk 50&apos;de bulunamadı.</p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 w-100" style={{ maxWidth: 700 }}>
          <History />
        </div>
      )}

      {allResults.length > 0 && (
        <div className="mt-5 w-100" style={{ maxWidth: 700 }}>
          <RankingChart results={allResults} highlightDomain={domain} />
        </div>
      )}
    </div>
  );
}
