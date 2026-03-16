const router = require("express").Router();
const db = require("../models");

const user = require("../models/user");
const postService = require ('../services/postServices');
const constraints = { 
    email: { 
        length: {
        minimun: 4,
        maximum: 200,
        tooShort: "^E-postadressen måste vara minst %{count} tecken lång.",
        tooLong: "^E-postadressen får inte vara längre än %{count} tecken lång."
        },
        email: {
        message: "^E-postadressen måste vara en giltig e-postadress."
        }
},
username: {
length: {
        minimun: 3,
        maximum: 50,
        tooShort: "^Användarnamnet måste vara minst %{count} tecken långt.",
        tooLong: "^Användarnamnet får inte vara längre än %{count} tecken långt."
        }
},
imageurl: {
    url: {
        message: 'Sökvägen är felaktig.'
    }
}
};

router.get('/', (req, res) => {
   postService.getAll().then ((result) => {
    res.status(result.status).json(result.data);
   });
});

router.post('/', (req, res) => {
    const post = req.body;
      postService.create(post).then ((result) => {
      res.status(result.status).json(result.data);
   });
});
router.put('/', (req, res) => {
     const post = req.body;
     const id = post.id;

     postService.update(post, id).then ((result) => {
     res.status(result.status).json(result.data);
   });
});
router.delete('/', (req, res) => {

  const id = req.body.id

    postService.destroy(id).then ((result) => {
    res.status(result.status).json(result.data);
    });


});



module.exports = router;