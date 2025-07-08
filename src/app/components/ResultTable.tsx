interface ResultType {
  keyword: string;
  position: number | null;
  url: string | null;
}

interface ResultType {
  keyword: string;
  position: number | null;
  url: string | null;
}

interface ResultTableProps {
  result: ResultType;
}

export default function ResultTable({ result }: ResultTableProps) {
  const renderProgress = (position: number | null) => {
    if (position === null) return "Bulunamadı";
    const value = Math.max(1, 100 - position); // pozisyon 1 ise 99% görünür
    return (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${value}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}>
          {`#${position}`}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h5>Organik Sonuç:</h5>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Anahtar Kelime</th>
            <th>Pozisyon</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{result.keyword}</td>
            <td>{renderProgress(result.position)}</td>
            <td>
              {result.url ? (
                <a href={result.url} target="_blank" rel="noreferrer">
                  {result.url}
                </a>
              ) : (
                "—"
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* <h5 className="mt-4">Reklam Sonucu:</h5>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Anahtar Kelime</th>
            <th>Pozisyon</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{result.ad.keyword}</td>
            <td>{renderProgress(result.ad.position)}</td>
            <td>
              {result.ad.url ? (
                <a href={result.ad.url} target="_blank" rel="noreferrer">
                  {result.ad.url}
                </a>
              ) : (
                "—"
              )}
            </td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
}
