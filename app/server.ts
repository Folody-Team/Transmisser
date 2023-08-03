import express from 'express';
import path from 'path';

const _express = express()

const port = process.env.PORT || 3000;

_express.use(express.static(path.join(__dirname, './build')));

_express.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'app.html'));
});


_express.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
