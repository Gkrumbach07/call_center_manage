import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT || "http://0.0.0.0:8080";

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

function createData(name, nouns, sentence, quality,) {
  return { name, nouns, sentence, quality };
}

export default function ClientComponent() {
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("FromKafka", data => {
      setRows(rows.push(createData("12345", str(data.nouns), sentence, quality)))
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Call&nbsp;Line</TableCell>
            <TableCell align="left">Top Words</TableCell>
            <TableCell align="left">Recent Sentence</TableCell>
            <TableCell align="left">Quality</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} className={row.quality === "POSITIVE" ? classes.rowPos: classes.rowNeg}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.noun}</TableCell>
              <TableCell align="left">{row.sentence}</TableCell>
              <TableCell align="left">{row.quality}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
