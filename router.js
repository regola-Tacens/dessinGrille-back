const express = require('express');
const router = express.Router();

const mainController = require('./mainController');

router.get('/', mainController.home);
router.get('/library', mainController.library);
router.get('/login', mainController.login);
router.get('/signup', mainController.signup);

module.exports = router;