const router = require('express').Router();
router.get('/', (req, res) => res.status(200).json({ status: 'awake', timestamp: new Date() }));
module.exports = router;
