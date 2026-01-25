const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/theme', (req, res) => {
  res.json({ 
    primaryColor: '#1976D2',
    secondaryColor: '#64B5F6',
    backgroundColor: '#E3F2FD'
  });
});

app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cb.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});