/**
 * TEKNISKT KRAV: Backend & API-struktur (RESTful API)
 * Denna fil definierar endpoints för produkter. Vi använder Express Router för att 
 * skapa en tydlig separation mellan rutter (routes) och affärslogik (services), 
 * vilket ger en hållbar och skalbar arkitektur.
 */

const router = require("express").Router();

const product = require("../models/product");
const postService = require ('../services/productService');

// Lägger till en kommentar på en specifik produkt
router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const id = req.params.id;
      productService.addComment(id, comment).then ((result) => {
      res.status(result.status).json(result.data);
   });
});

// Hämtar en enskild produkt via ID
router.get("/:id", async (reg, res) => {
    const id = req.params.id;

    const result = await productService.getById(id).then ((result) => {
    res.status(result.status).json(result.data);
   });
});

// Hämtar alla produkter
router.get('/', (req, res) => {
   productService.getAll().then ((result) => {
    res.status(result.status).json(result.data);
   });
});

// Skapar en ny produkt
router.post('/', (req, res) => {
    const product = req.body;
      productService.create(product).then ((result) => {
      res.status(result.status).json(result.data);
   });
});

// Uppdaterar en befintlig produkt – ID hämtas från request body
router.put('/', (req, res) => {
     const post = req.body;
     const id = post.id;

     postService.update(post, id).then ((result) => {
     res.status(result.status).json(result.data);
   });
});

// Tar bort en produkt – ID hämtas från request body
router.delete('/', (req, res) => {
  const id = req.body.id

    postService.destroy(id).then ((result) => {
    res.status(result.status).json(result.data);
    });
});

module.exports = router;