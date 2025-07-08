"use client";

import { FormEvent, useState } from "react";

interface SearchFormProps {
  onSearch: (domain: string, keyword: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(domain, keyword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="domain" className="form-label">
          Domain
        </label>
        <input
          id="domain"
          type="url"
          className="form-control"
          placeholder="https://ornek.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="keyword" className="form-label">
          Anahtar Kelime
        </label>
        <input
          id="keyword"
          type="text"
          className="form-control"
          placeholder="ör. yazılım mühendisi"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}>
        {loading ? "Sorgulanıyor..." : "Sorgula"}
      </button>
    </form>
  );
}
