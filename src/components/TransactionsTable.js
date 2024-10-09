import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('03');
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`/api/transactions`, {
      params: { search, month, page }
    }).then(response => {
      setTransactions(response.data);
    });
  }, [search, month, page]);

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search transactions" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        {/* Add all other months */}
      </select>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.productTitle}</td>
              <td>{transaction.productDescription}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default TransactionsTable;
