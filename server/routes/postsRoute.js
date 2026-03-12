const router = require("express").Router();
const db = require("../models");


router.get('/', (req, res) => {
    db.Posts.findAll().then((result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
 db.Posts.create(req.body).then((result) => {
    res.send(result);
  });
});
router.put('/', (req, res) => {
  db.Posts.update(req.body, {
    where: { id: req.body.id }
  })
    .then((result) => { 
        res.send(result);
    })
});
router.delete('/', (req, res) => {
  res.send("delete posts");
});



module.exports = router;