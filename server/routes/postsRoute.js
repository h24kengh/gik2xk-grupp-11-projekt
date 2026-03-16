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
    const user = req.body;
    
});
router.put('/', (req, res) => {
     const user = req.body;
    const invalidData = validate(user, constraints);
    const id = user.id;
    if(invalidData || !id) {
        res.status(400).json(invalidData || 'Id är obligatoriskt.');
    } else {
 db.users
  .update(user, {
    where: { id: user.id }
  })
    .then((result) => { 
        res.send(result);
    });
    }
});
router.delete('/', (req, res) => {
  db.users
  .destroy({
    where: { id: req.body.id }
  }).then((result) => {
    res.json(`produkten raderades ${result}`);
  });
});



module.exports = router;