import React, { useEffect, useState } from "react";
import axios from "axios";

const MyResults = () => {

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadResults();

    }, []);

    const loadResults = async () => {

        try {

            const res = await axios.get(

                "http://localhost:8081/result/my-results",

                {

                    withCredentials: true

                }

            );

            setResults(res.data.results);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="container">

            <h2>My Results</h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Assessment</th>

                        <th>Score</th>

                        <th>Total</th>

                        <th>Percentage</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        results.map((item)=>(

                            <tr key={item._id}>

                                <td>{item.assessment.title}</td>

                                <td>{item.score}</td>

                                <td>{item.totalMarks}</td>

                                <td>{item.percentage}%</td>

                                <td>{item.status}</td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default MyResults;