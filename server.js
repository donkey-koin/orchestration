import express from "express";

const app = express();
const port = process.env.PORT || 5000;

app.get('/api', (req, res) => {
  res.send({ express: 'Hallo' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));