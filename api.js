const express = require('express');
const app = express();
app.use(express.json());
var cors = require('cors')
app.use(cors())

let users = [];

// Helper function to generate a simple token
const generateToken = (email) => `${email}-token`;

// Sign up endpoint
app.post('/sign-up', (req, res) => {
  
  const email = req.body.email

  if (users.find(user => user.data.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { data: req.body, id: users.length + 1 };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Sign in endpoint
app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.data.email === email && user.data.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(email);

  res.json({ token: token, id: user.id });
});


// Get user info
app.get('/user/:id', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const userId = parseInt(req.params.id, 10);

    const user = users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (generateToken(user.data.email) !== token) {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    res.json({ id: user.id, data: user.data });
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
