import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('/api/statistics', { params: { month } })
      .then(response => setStats(response.data));
  }, [month]);

  return (
    <div>
      <h3>Statistics for month {month}</h3>
      <p>Total Sale Amount: {stats.totalAmount}</p>
      <p>Total Sold Items: {stats.totalSoldItems}</p>
      <p>Total Unsold Items: {stats.totalUnsoldItems}</p>
    </div>
  );
};

export default Statistics;
