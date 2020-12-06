const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.port || 8080;

// Routes for API
const router = express.Router();
router.get('/', function(req, res) {
    res.json({message: 'API access complete'});
});

// Register routes
app.use('/api', router);

// Start server
app.listen(port);
console.log(`> Server started on port ${port}`);