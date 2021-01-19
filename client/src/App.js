import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import ClientComponent from "./ClientComponent";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  rowPos: {
    backgroundColor: '#a9e0a9'
  },
  rowNeg: {
    backgroundColor: '#e0a9a9'
  },
});

function createData(name, quality,) {
  return { name, quality };
}

const rows = [
  createData('1241223', "POSITIVE"),
  createData('234234', "NEGATIVE"),
  createData('3453245', "POSITIVE"),
  createData('234224', "NEGATIVE"),
  createData('34535', "NEGATIVE"),
  createData('12313123123', "POSITIVE"),
  createData('324234', "POSITIVE"),

];


export default function App() {
  const classes = useStyles();

  const [loadClient, setLoadClient] = useState(true);

  return (
    <div>
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        TOGGLE CLIENT
      </button>
      {loadClient ? <ClientComponent /> : null}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Call&nbsp;Line</TableCell>
              <TableCell align="left">Quality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} className={row.quality === "POSITIVE" ? classes.rowPos: classes.rowNeg}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.quality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
