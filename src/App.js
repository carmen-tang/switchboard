import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import './App.css';

const columns = [
  { id: 'First Name', label: 'First Name', minWidth: 150 },
  { id: 'Last Name', label: 'Last Name', minWidth: 150 },
  { id: 'Contribution Amount', label: 'Contribution Amount', minWidth: 150 },
  { id: 'Refcode', label: 'Refcode', minWidth: 150 },
];

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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    console.log('hereee');
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="App">
      {/* <div>
        {data.slice(0, 10).map(i => {
          return <div key={i.id}>{i.donor_firstname} {i.donor_lastname}</div>
        })
        }
      </div> */}
      <Paper>
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
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>
                    {row.donor_firstname}
                  </TableCell>
                  <TableCell>
                    {row.donor_lastname}
                  </TableCell>
                  <TableCell>
                    {row.amount}
                  </TableCell>
                  <TableCell>
                    {row.refcode}
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
