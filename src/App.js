import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  { id: 'Contribution Amount', label: 'Contribution Amount', minWidth: 150 },
];

function App() {
  const [data, setData] = useState([]);
  // console.log(data);

  const getData = () => {
    axios.get('switchboard.json')
    .then(res => {
      setData(res.data);
      setRows(res.data);
    })
  }

  useEffect(() => {
    getData();
  },[])

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
    </Paper>
    </div>
  );
}

export default App;
