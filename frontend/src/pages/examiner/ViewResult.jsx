import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

const ViewResults = () => {
  const { id } = useParams();

  const [results, setResults] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get(`/examiner/results/${id}`);

    setResults(res.data.results);
  };

  return (
    <div>
      <h1>Assessment Results</h1>

      <table>
        <thead>
          <tr>
            <th>Candidate</th>

            <th>Score</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.user.name}</td>

              <td>{r.score}</td>

              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
