const db = require ('../models');
const {
    createResponseSuccess,
    createResponseError,
    createResponseMessage
} = require('../helpers/responsehelper');
const validate = require('validate.js');    
const  post  = require('../models/product');
const user = require('../models/user');

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

async function getByTag(tagId) {
    try {
        const tag = await db.tag.findOne({ where: {id: tagId } });
        const allPosts =  await tag.getPosts({include: [db.user, db.tag]});
        /* Om allt blev bra, returna allPosts */
        return createResponseSuccess(allPosts.map(post => _formatPost(post)));
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

async function getByAuthor(userId) {
    try {
        const user = await db.user.findOne({ where: {id: userId } });
        const allPosts =  await user.getPosts({include: [db.user, db.tag]});
        /* Om allt blev bra, returna allPosts */
        return createResponseSuccess(allPosts.map(post => _formatPost(post)));
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

async function getById(id) {
    try {

        const product =  await db.product.findOne({
            where: { id }, 
            include: 
            [db.comment, 
            db.tag,
            {
            model: db.comment, 
            include: [db.user] 
            }]
        });

        /* Om allt blev bra, returna post */
        if (!product) return createResponseError(404, "Produkten hittades inte.")
        return createResponseSuccess(product);
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

async function getAll(searchTerm) {
    try {
        const whereClause = searchTerm ? {
            title: {[Op.like]: '%${searchTerm}%' }
        }: {};

        const allProducts =  await db.product.findAll({
            where: whereClause,
            include: [db.tag]});
        /* Om allt blev bra, returna allPosts */
        return createResponseSuccess(allProducts.map(post => _formatPost(post)));
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
 
}

async function addComment(productId, comment) {
   
    if (!id) {
       return createResponseError(422, "ID är obligatoriskt");
    }  
    try {
        const product = await db.product.findOne(productId)
        comment.productId = id;
        const newComment =  await db.comment.create(comment);
        return createResponseSuccess(newComment);
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
  
}

async function create(productData) {
    const invalidData = validate(post, constraints);
    if (invalidData) {
       return createResponseError(422, invalidData);
    }  try {
           const newProduct =  await db.product.create(productData);
            //post tags är en  array av namn
           //lägga till eventuella taggar
           await _addTagToPost(newPost, post.tags);
           return createResponseSuccess(newProduct);
        } catch (error) {
        return createResponseError(error.status, error.message);
    }
  
}
async function update(productId, qtyChange) {
        const invalidData = validate(post, constraints);
        if(!id) {
            return createResponseError(422, "ID är obligatoriskt");
        }
        if(invalidData) {
           return createResponseError(422, invalidData);
        } 
        try {
            const product = await db.product.findOne({where: {id}});
             if(!product) {
            return createResponseError(404, "Hittade inget inlägg att uppdatera.");
            }
            await _addTagToPost(existingPost, post.tags);
            const newQty = Math.max(0,product.inventory_qty + quantityChange);
            await db.product.update({inventory_qty: newQty
            });

            return createResponseMessage(200, "Lagersaldo uppdaterat till ${newQty}");
            } catch(error) {
            return createResponseError(error.status, error.message);
            }
           
        
}
async function destroy(id) {
    if(!id) {
        return createResponseError(422, "ID är obligatoriskt!");
    }
    try {
    await db.product.destroy({
        where: { id }
      });
      return createResponseMessage(200, "Produkt raderades.");
    } catch(error) {
            return createResponseError(error.status, error.message);
    }
}

function _formatPost(post) {
    const cleanPost = {
        id: post.id,
        title: post.title,
        body: post.body,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
            id: post.user.id,
            username: post.user.username,
            email: post.user.email,
            firstname: post.user.firstname,
            lastname: post.user.lastname,
            imageUrl: post.user.imageUrl
        },
        tags: []
    };
   if (post.comments) {
    cleanPost.comments = [];
    post.comments.map((comment) => {
        return (cleanPost.comments = [
            {

            title: comment.title,
            body: comment.body,
            author: comment.user.username,
            createdAt: comment.createdAt

            }, 
            ...cleanPost.comments
        ]);
    });
   }
   if (post.tags) {
    post.tags.map((tag) => {
        return (cleanPost.tags = [tag.name, ...cleanPost.tags]);
   });
   return cleanPost;
   }
}

async function _findOrCreateTagId(name) {
    name = name.toLowerCase().trim();
    const foundOrCreatedTag = await db.tag.findOrCreate({where: { name } });

    return foundOrCreatedTag[0].id;
}

async function _addTagToPost(post, tags) {
    if (tags) {
        tags.foreach(async (tag) => {
            const tagId = await _findOrCreateTagId(tag);
            await post.addTag(tagId);
        });
    }
}

module.exports = { 
    getByAuthor,
    getByTag,
    getById,
    getAll, 
    addComment,
    create, 
    update, 
    destroy };