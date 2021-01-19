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


export default function ClientComponent() {
  const [rows, setRows] = useState({});

  const classes = useStyles();

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("FromKafka", data => {
      var parsed = JSON.parse(data)
      var temp = JSON.parse(JSON.stringify(rows))

      var word_ranking = {}
      if(temp[parsed['id']]) {
        word_ranking = JSON.parse(JSON.stringify(rows[parsed['id']]["ranked_nouns"]));
        temp[parsed['id']]['nouns'].map(word => {
          if(word_ranking[word]) {
            word_ranking[word] = word_ranking[word] + 1
          }
          else {
            word_ranking[word] = 1
          }
        })
      }
      else {
        temp[parsed['id']]['nouns'].map(word => {
          word_ranking[word] = 1
        })
      }

      temp[parsed['id']] = parsed
      temp[parsed['id']]['ranked_nouns'] = word_ranking
      setRows(temp)
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, [rows]);

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
          {Object.keys(rows).map((row) => (
            <TableRow key={rows[row]['id']} className={rows[row]['quality'] === "POSITIVE" ? classes.rowPos: classes.rowNeg}>
              <TableCell component="th" scope="row">
                {rows[row]['id']}
              </TableCell>
              <TableCell align="left">{rows[row]['ranked_nouns'].slice(0,5).map((word) => {word})}</TableCell>
              <TableCell align="left">{rows[row]['sentence']}</TableCell>
              <TableCell align="left">{rows[row]['quality']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
