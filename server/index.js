const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const secretKey = "secretKey";

// Middleware function to log request details
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const accessToken = req.headers.authorization || "No Access Token"; 

  console.log(`[${timestamp}] ${method}: ${url}, AccessToken: "${accessToken}"`);
  next();
}


app.use(requestLogger);

app.use(express.json());

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: 'saurav',
    email: 'test@gmail.com'
  };
  jwt.sign({ user }, secretKey, { expiresIn: '500s' }, (err, token) => {
    res.status(200).json({ token });
  });
});

// Profile Route
app.post('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, auth) => {
    if (err) {
      res.send({ result: 'error invalid token' });
    } else {
      res.json({ msg: 'successful', auth });
    }
  });
});

// Token Verification Middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      result: 'Token is not valid'
    });
  }
}

// Start the server
app.listen(PORT, () => {
  console.log('Server connected successfully');
});


