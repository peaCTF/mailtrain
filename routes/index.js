'use strict';

let express = require('express');
let router = new express.Router();
let _ = require('../lib/translate')._;

/* GET home page. */
router.get('/', (req, res) => {
    res.status(403);
    res.send();
});

module.exports = router;
