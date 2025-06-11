const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function evaluateExpression(expr) {
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error('Invalid characters');
  }
  return Function('"use strict"; return (' + expr + ')')();
}

app.post('/calculate', (req, res) => {
  const { expression } = req.body;
  if (typeof expression !== 'string') {
    return res.status(400).json({ error: 'Expression must be a string' });
  }
  try {
    const result = evaluateExpression(expression);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
