import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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


export default function ClientComponent() {
  const [rows, setRows] = useState({});

  const classes = useStyles();
  
  const blendColor = (x) => {
    const green = x >= 0 ? 201 : 201 - (96 * x * -1)
    const red = x <= 0 ? 201 : 201 - (96 * x)
    const blue = 201 - (96 * Math.abs(x))

    return `rgb(${red}, ${green}, ${blue})`
  }

  useEffect(() => {
    const socket = io(ENDPOINT);
    
    socket.on("FromKafka", data => {
        var parsed = JSON.parse(data)

        const updatedValue = {}
        updatedValue[parsed['id']] = parsed

        setRows(prevRows => {return{ ...prevRows, ...updatedValue }})
      });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);
    

  return (
    <div>
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Call&nbsp;Line</TableCell>
            <TableCell align="left">From Consumer</TableCell>
            <TableCell align="left">Nouns</TableCell>
            <TableCell align="left">Sentence</TableCell>
            <TableCell align="left">Quality</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(rows).map((row) => (
            <TableRow key={rows[row]['id']} style={{backgroundColor: blendColor(rows[row]["quality"])}}>
              <TableCell component="th" scope="row">
                {rows[row]['id'].toString()}
              </TableCell>
              {rows[row]['consumer']
              ? <TableCell align="left">{rows[row]['consumer'].toString()}</TableCell>
              : null}
              <TableCell align="left">{rows[row]['nouns'].toString()}</TableCell>
              <TableCell align="left">{rows[row]['sentence'].toString()}</TableCell>
              <TableCell align="left">{rows[row]['quality'].toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  )
}
