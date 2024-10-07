import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('3'); // Default to March
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get(`/transactions`, {
        params: { search, month, page, perPage }
      });
      setTransactions(response.data.transactions);
    };
    fetchTransactions();
  }, [search, month, page, perPage]);

  // Fetch statistics, bar chart data, and pie chart data
  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get(`/statistics`, { params: { month } });
      setStatistics(response.data);
    };
    
    const fetchBarData = async () => {
      const response = await axios.get(`/price-range`, { params: { month } });
      setBarData({
        labels: response.data.map(item => item._id),
        datasets: [{
          label: 'Number of items',
          data: response.data.map(item => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      });
    };

    const fetchPieData = async () => {
      const response = await axios.get(`/category-items`, { params: { month } });
      setPieData({
        labels: response.data.map(item => item._id),
        datasets: [{
          data: response.data.map(item => item.count),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'
          ]
        }]
      });
    };

    fetchStatistics();
    fetchBarData();
    fetchPieData();
  }, [month]);

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>
      <div>
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(m => (
            <option key={m} value={m}>{new Date(2023, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Search Transactions: </label>
        <input
          type="text"
          placeholder="Search by title, description, or price"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>

      <div>
        <h3>Statistics</h3>
        <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.soldItems}</p>
        <p>Total Not Sold Items: {statistics.notSoldItems}</p>
      </div>

      <div>
        <h3>Price Range Bar Chart</h3>
        <Bar data={barData} />
      </div>

      <div>
        <h3>Category Pie Chart</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

export default App;
