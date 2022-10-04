import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';

import './App.css';

const columns = [
  { id: 'First Name', label: 'First Name', minWidth: 150 },
  { id: 'Last Name', label: 'Last Name', minWidth: 150 },
  { id: 'Refcode', label: 'Refcode', minWidth: 150 },
  { id: 'Date', label: 'Date', minWidth: 150 },
  { id: 'Contribution Amount', label: 'Contribution Amount', minWidth: 150 },
];

function App() {
  // initial get data
  const [data, setData] = useState([]);

  const getData = () => {
    // use axios to get data from json file
    axios.get('switchboard.json')
    .then(res => {
      setData(res.data);
      setRows(res.data);
    })
  }

  useEffect(() => {
    getData();
  },[])

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // filtered rows
  const [rows, setRows] = useState(data);

  // refcodes array
  const refcodesArray = data.map((item) => item.refcode);
  let uniqueRefcodes = [...new Set(refcodesArray)];

  // search
  const [selectedOption, setSelectedOption] = useState("");

  const requestSearch = (searchedVal) => {
    const filteredRows = data.filter((row) => {
      return row.refcode.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const handleAutoChange = (event, value) => {
    console.log(selectedOption);
    setSelectedOption(value);
  }

  useEffect(() => {
    requestSearch(selectedOption);
  },[selectedOption])

  // clear search
  const clearSearch = () => {
    setRows(data);
  }

  // total raised
  const [raised, setRaised] = useState(0);
  const [showAmountTotals, setShowAmountTotals] = useState(false);

  const showTotals = () => {
    setShowAmountTotals(true);
  }

  const getRaisedMoney = () => {
    const raisedMoney = data.map((item) => item.amount);
    const sumRaisedMoney = raisedMoney.reduce((a, b) => a + b, 0).toFixed(2);
    let nf = new Intl.NumberFormat('en-US');
    const formatMoney = nf.format(sumRaisedMoney);
    setRaised(formatMoney);
  }

  useEffect(() => {
    getRaisedMoney();
  },[showAmountTotals])

  // date
  // const day = dayjs('2021-06-01 08:22:45+00').format('MM/DD/YYYY');
  // const daysub = dayjs(day).subtract(7, 'day').format('MM/DD/YYYY');
  // console.log(daysub);

  return (
    <div className="App">
      <Paper className="main-body">

      <h1>Fundraising Dashboard</h1>

      <Autocomplete
        id="refcodes-autocomplete"
        freeSolo
        options={uniqueRefcodes}
        renderInput={(params) => <TextField {...params} label="Search By Refcode" />}
        onChange={handleAutoChange}
        disableClearable
        inputValue=""
      />
      <Button onClick={clearSearch}>Clear Search</Button>

      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                >
                  {column.id}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>
                    {row.donor_firstname}
                  </TableCell>
                  <TableCell>
                    {row.donor_lastname}
                  </TableCell>
                  <TableCell>
                    {row.refcode}
                  </TableCell>
                  <TableCell>
                    {dayjs(row.paid_at).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell>
                    ${row.amount}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Button onClick={showTotals}>Show Amount Raised</Button>
      {showAmountTotals &&
        <div className="amount-raised">
          Total Raised: ${raised}
        </div>
      }
    </Paper>
    </div>
  );
}

export default App;
