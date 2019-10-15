const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;
const app = express();

const router = express.Router();

const jsonParser = bodyParser.json()

/**
 * Serve index.html to be deploy in PROD
 * @param req
 * @param res
 */
function serverRenderer (req, res) {
  fs.readFile(path.resolve('./build/index.html'), 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }
    return res.send(data);
  });
}

function logError(req, res) {
  const { type, message } = req.body || {};
  switch (type) {
    case 'debug':
      console.debug(message);
      break;
    case 'info':
      console.info(message);
      break;
    case 'warning':
      console.warn(message);
      break;
    default:
      console.error(message);
      break;
  }

  res.status(200).end();
}

router.use('^/$', serverRenderer);    //serve root path
router.use('^/home', serverRenderer); //serve home path
router.post('/log-error', jsonParser, logError);  // get data from endpoint or cache

router.use(
  express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
);

// tell the app to use the above rules
app.use(router);

// app.use(express.static('./build'))
app.listen(PORT, () => {
  console.log(`running on port ${ PORT }`);
});
