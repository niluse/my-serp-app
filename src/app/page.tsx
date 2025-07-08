"use client";

import { useState } from "react";
import axios from "axios";
import SearchForm from "./components/SearchForm";
import ResultTable from "./components/ResultTable";
import ErrorAlert from "./components/ErrorAlert";
import History from "./components/History";
interface ResultType {
  keyword: string;
  position: number | null;
  url: string | null;
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (domain: string, keyword: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.get("/api/serp", {
        params: {
          api_key: process.env.NEXT_PUBLIC_SERP_API_KEY,
          q: keyword,
          num: 100,
          hl: "tr",
          gl: "tr",
        },
      });

      const cleanedDomain = domain
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

      const organic = response.data.organic_results || [];

      const organicIdx = organic.findIndex((r: any) =>
        (r.link as string).includes(cleanedDomain)
      );
      const organicResult = {
        keyword,
        position: organicIdx >= 0 ? organicIdx + 1 : null,
        url: organicIdx >= 0 ? organic[organicIdx].link : null,
      };

      setResult(organicResult);

      const history = JSON.parse(localStorage.getItem("serp_history") || "[]");
      history.unshift({
        date: new Date().toISOString(),
        result: organicResult,
      });
      localStorage.setItem(
        "serp_history",
        JSON.stringify(history.slice(0, 10))
      );
    } catch (err: any) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="mb-4">SERP Sıralama Kontrolü</h1>
              <SearchForm onSearch={handleSearch} loading={loading} />
              {error && <ErrorAlert message={error} />}
              {result && <ResultTable result={result} />}
              <History />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
