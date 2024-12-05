require('dotenv').config();
const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const port = 8888;

const client_id = "e0d1fa234a3247d690f4eae20f2f3598";
const client_secret = "dd4bafdc20cd4c70ac9eb1e4d5f8388e";
const redirect_uri = "http://localhost:8888/callback";
console.log("CLIENT_ID", client_id);


app.use(cors());

// Login route - Redirects the user to Spotify's authorization page
app.get('/login', function (req, res) {
  const state = generateRandomString(16); // Protect against CSRF attacks
  const scope = 'user-read-private user-read-email';

  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true,
    });

  res.redirect(authUrl);
});

app.get('/callback', function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (!code) {
    res.status(400).send('Authorization code not found');
    return;
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:8888/callback',
      grant_type: 'authorization_code',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;

      // Redirect to frontend with the access token
      res.redirect(
        `http://localhost:3000/#access_token=${access_token}`
      );
    } else {
      res.status(400).send('Failed to exchange token');
    }
  });
});

app.get('/', (req, res) => {
  res.send('Spotify Auth Server is running');
});


// Helper function to generate random state string
function generateRandomString(length) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join('');
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
