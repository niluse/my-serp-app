interface ResultType {
  keyword: string;
  position: number | null;
  url: string | null;
}

interface ResultTableProps {
  result: ResultType;
}

export default function ResultTable({ result }: ResultTableProps) {
  return (
    <div className="mt-4">
      <h5>Sonuç:</h5>
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
            <td>{result.position ?? "Bulunamadı"}</td>
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
    </div>
  );
}
