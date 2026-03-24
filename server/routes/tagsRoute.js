const router = require("express").Router();
const db = require("../models");
const postService = require("../services/productService")

// Hämtar alla produkter kopplade till en specifik tagg
router.get("/:id/posts", (req, res) => {
   const id = req.params.id;
  
      postService.getByTag(id).then ((result) => {
      res.status(result.status).json(result.data);
     });
});

// Hämtar alla taggar
router.get('/', (req, res) => {
    db.tag.findAll().then((result) => {
        res.send(result);
    });
});

// Skapar en ny tagg
router.post('/', (req, res) => {
    const tag = req.body;
         db.tag.create(tag).then((result) => {
    res.send(result);
    });
});

// Tar bort en tagg via ID i request body
router.delete('/', (req, res) => {
  db.tag
  .destroy({
    where: { id: req.body.id }
  }).then((result) => {
    res.json(`produkten raderades ${result}`);
  });
});

module.exports = router;