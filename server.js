import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 5000;
const url =
  "http://localhost:8080/values";


app.get('/api', (req, res) => {
  axios
  .get(url)
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
    res.send({express:'Hallo'});
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));