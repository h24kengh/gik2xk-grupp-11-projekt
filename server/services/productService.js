const db = require('../models');
const {
    createResponseSuccess,
    createResponseError,
    createResponseMessage
} = require('../helpers/responsehelper');
const validate = require('validate.js');    
const post = require('../models/product');
const user = require('../models/user');

// Valideringsregler för användardata
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

// Statisk mock-data för produkter (används som fallback)
const products = [
    {
      id: 1,
      name: 'Första produkten',
      price: 10.99,
      description: 'Detta är den första produkten. Den passar perfekt för dig som vill ha en enkel och prisvärd produkt.',
      stock: 5,
      image: 'https://via.placeholder.com/600x400?text=Produkt+1',
    },
    {
      id: 2,
      name: 'Andra produkten',
      price: 15.99,
      description: 'Detta är den andra produkten. Ett bra val för dig som vill ha något lite bättre och mer användbart.',
      stock: 3,
      image: 'https://via.placeholder.com/600x400?text=Produkt+2',
    },
    {
      id: 3,
      name: 'Tredje produkten',
      price: 20.99,
      description: 'Detta är den tredje produkten. Ett premiumalternativ för dig som vill ha högre kvalitet.',
      stock: 7,
      image: 'https://via.placeholder.com/600x400?text=Produkt+3',
    },
  ];

// Hämtar alla produkter kopplade till en specifik tagg
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

// Hämtar alla produkter skrivna av en specifik användare
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

// Hämtar en enskild produkt med kommentarer, taggar och betyg
async function getById(id) {
    try {
        const product = await db.product.findOne({
            where: { id }, 
            include: [
                db.comment, 
                db.tag,
                {
                    model: db.comment, 
                    include: [db.user] 
                },
                {   // inkludera ratings
                    model: db.rating,
                    as: 'ratings',
                    required: false
                }
            ]
        });

        if (!product) return createResponseError(404, "Produkten hittades inte.");
        
        // Formatera med snittbetyg innan returnering
        const formattedProduct = _formatProductWithRating(product);
        return createResponseSuccess(formattedProduct);
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

// Hämtar alla produkter med taggar och betyg, med valfri sökning på titel
async function getAll(searchTerm) {
    try {
        const whereClause = searchTerm ? {
            title: {[Op.like]: '%${searchTerm}%' }
        }: {};

        const allProducts = await db.product.findAll({
            where: whereClause,
            include: [
                db.tag,
                {   // inkludera ratings
                    model: db.rating,
                    as: 'ratings',
                    required: false
                }
            ]
        });
        
        // Formatera varje produkt med snittbetyg
        const formattedProducts = allProducts.map(product => _formatProductWithRating(product));
        return createResponseSuccess(formattedProducts);
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

// Lägger till eller uppdaterar ett betyg för en produkt
async function addRating(productId, userId, value) {
    if (!productId || !userId || !value) {
        return createResponseError(422, "Produkt-ID, användar-ID och betyg krävs");
    }
    
    if (value < 1 || value > 5) {
        return createResponseError(422, "Betyg måste vara mellan 1 och 5");
    }
    
    try {
        // Kontrollera att produkten finns
        const product = await db.product.findOne({ where: { id: productId } });
        if (!product) {
            return createResponseError(404, "Produkten hittades inte");
        }
        
        // Skapar ett nytt betyg eller uppdaterar om användaren redan betygsatt
        const [rating, created] = await db.rating.findOrCreate({
            where: { 
                product_id: productId, 
                user_id: userId 
            },
            defaults: { 
                value: value,
                product_id: productId,
                user_id: userId
            }
        });
        
        // Om betyget redan fanns, uppdatera värdet
        if (!created) {
            rating.value = value;
            await rating.save();
        }
        
        return createResponseSuccess(rating);
    } catch (error) {
        console.error('Fel vid betygsättning:', error);
        return createResponseError(500, error.message);
    }
}

// Hämtar alla betyg för en produkt samt beräknar snittbetyg
async function getRatings(productId) {
    if (!productId) {
        return createResponseError(422, "Produkt-ID krävs");
    }
    
    try {
        const ratings = await db.rating.findAll({
            where: { product_id: productId },
            attributes: ['value', 'user_id', 'createdAt']
        });
        
        // Beräknar snittbetyg, returnerar 0 om inga betyg finns
        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
            : 0;
        
        return createResponseSuccess({
            ratings: ratings,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalRatings: ratings.length
        });
    } catch (error) {
        console.error('Fel vid hämtning av betyg:', error);
        return createResponseError(500, error.message);
    }
}

// Lägger till en kommentar på en specifik produkt
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

// Skapar en ny produkt och kopplar eventuella taggar
async function create(productData) {
    const invalidData = validate(post, constraints);
    if (invalidData) {
       return createResponseError(422, invalidData);
    }  try {
           const newProduct =  await db.product.create(productData);
           // Lägger till eventuella taggar kopplade till produkten
           await _addTagToPost(newPost, post.tags);
           return createResponseSuccess(newProduct);
        } catch (error) {
        return createResponseError(error.status, error.message);
    }
}

// Uppdaterar lagersaldot för en produkt
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
            // Säkerställer att lagersaldot aldrig blir negativt
            const newQty = Math.max(0,product.inventory_qty + quantityChange);
            await db.product.update({inventory_qty: newQty
            });

            return createResponseMessage(200, "Lagersaldo uppdaterat till ${newQty}");
            } catch(error) {
            return createResponseError(error.status, error.message);
            }
}

// Tar bort en produkt permanent från databasen
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

// Hjälpfunktion: Formaterar en produkt och lägger till snittbetyg och betygsinfo
function _formatProductWithRating(product) {
    const ratings = product.ratings || [];
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
        : 0;
    
    // Konverterar Sequelize-objekt till vanligt JS-objekt
    const formattedProduct = product.toJSON ? product.toJSON() : product;
    
    // Lägger till beräknad betygsinformation på produktobjektet
    formattedProduct.averageRating = parseFloat(averageRating.toFixed(1));
    formattedProduct.totalRatings = totalRatings;
    formattedProduct.ratings = ratings.map(r => ({
        value: r.value,
        userId: r.user_id,
        createdAt: r.createdAt
    }));
    
    return formattedProduct;
}

// Hjälpfunktion: Formaterar ett inlägg med författare, kommentarer och taggar
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

// Hjälpfunktion: Hittar eller skapar en tagg baserat på namn
async function _findOrCreateTagId(name) {
    name = name.toLowerCase().trim();
    const foundOrCreatedTag = await db.tag.findOrCreate({where: { name } });

    return foundOrCreatedTag[0].id;
}

// Hjälpfunktion: Kopplar en lista av taggar till ett inlägg
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
    destroy,
    addRating,      
    getRatings      
};