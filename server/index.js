const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('AudioArchive Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is humming along on http://localhost:${PORT}`);
});