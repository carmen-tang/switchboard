import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  console.log(data);

  const getData = () => {
    axios.get('switchboard.json')
    .then(res => {
      // console.log(res);
      // console.log(res.data);
      console.log('here');
      setData(res.data);
    })
  }

  useEffect(() => {
    getData();
  },[])

  return (
    <div className="App">
      <div>
        {data.slice(0, 10).map(i => {
          return <div key={i.id}>{i.donor_firstname} {i.donor_lastname}</div>
        })
        }
      </div>
    </div>
  );
}

export default App;
