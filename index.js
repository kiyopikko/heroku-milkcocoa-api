// JSONファイルの読み込み（ローカル用）/////////////////////////////////
var fs = require('fs');
var setting = {};
var MILKCOCOA_APP_ID = "";
var MILKCOCOA_DATASTORE_ID = "";
if( process.env.PORT ) {
    // Heroku上では環境変数から読み込む（インストール時に設定）
    MILKCOCOA_APP_ID = process.env.MILKCOCOA_APP_ID;
    MILKCOCOA_API_KEY = process.env.MILKCOCOA_API_KEY;
    MILKCOCOA_DATASTORE_ID = process.env.MILKCOCOA_DATASTORE_ID;
} else {
    // .envフォルダはあらかじめ .gitignore 対象にしておく。
    setting = JSON.parse(fs.readFileSync('.env/setting.json', 'utf8'));
    //
    MILKCOCOA_APP_ID = setting.MILKCOCOA_APP_ID;
    MILKCOCOA_API_KEY = process.env.MILKCOCOA_API_KEY;
    MILKCOCOA_DATASTORE_ID = setting.MILKCOCOA_DATASTORE_ID;
}

console.log("MILKCOCOA_APP_ID:" + MILKCOCOA_APP_ID);
console.log("MILKCOCOA_DATASTORE_ID:" + MILKCOCOA_DATASTORE_ID)

const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: 'https://pubsub1.mlkcca.com', // バックエンドB のURL:port を指定する
  headers: {
    'ContentType': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
});
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var urlencodedParser = bodyParser.urlencoded({ extended: true })
var jsonParser = bodyParser.json()

app.get('/', function(request, response) {
  response.send('Hello Milkcocoa!');
});

app.get('/mail', function(request, response) {
  console.log(request)
  response.sendStatus(200);
});

app.post('/mail', function(request, response) {
  console.log(request)
  response.sendStatus(200);
});

app.post('/push', jsonParser, function(request, response) {
  // application/json
  if (!request.body) return response.sendStatus(400)

  axios.get('/api/push/' + MILKCOCOA_APP_ID + '/' + MILKCOCOA_API_KEY, {
    params: {
      c: MILKCOCOA_DATASTORE_ID,
      v: request.body
    }
  }).then(() => {
    response.sendStatus(200);
  }).catch(() => {
    response.sendStatus(400);
  })
});

app.post('/send', jsonParser, function(request, response) {
  // application/json
  if (!request.body) return response.sendStatus(400)

  axios.get('/api/send/' + MILKCOCOA_APP_ID + '/' + MILKCOCOA_API_KEY, {
    params: {
      c: MILKCOCOA_DATASTORE_ID,
      v: request.body
    }
  }).then(() => {
    response.sendStatus(200);
  }).catch(() => {
    response.sendStatus(400);
  })
});

app.post('/set', jsonParser, function(request, response) {
  // application/json
  if (!request.body) return response.sendStatus(400)

  axios.get('/api/set/' + MILKCOCOA_APP_ID + '/' + MILKCOCOA_API_KEY, {
    params: {
      c: MILKCOCOA_DATASTORE_ID,
      id: request.body.id,
      v: request.body.params
    }
  }).then(() => {
    response.sendStatus(200);
  }).catch(() => {
    response.sendStatus(400);
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});