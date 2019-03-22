const express = require('express');
const router = express.Router();

const Instagram = require('node-instagram').default;
const {clientId,clientSecret} = require('../keys').instagram;


// instannciando el modulo de instagram
const instagram = new Instagram({
    clientId:clientId,
    clientSecret:clientSecret
});


const redirecUri= 'http://localhost:3000/handleauth';

// ruta principal que devuelve una vista y eso redirige a /login

router.get('/', (req,res) => {
    res.render('index');
});

// ruta login que redirige a otra ruta

router.get('/login',(req,res)=>{
    res.redirect('/auth/instagram');
});

// ruta que tambien redirige a otra pero con datos de autorización de Instagram

router.get('/auth/instagram',(req,res)=>{
    res.redirect(
        instagram.getAuthorizationUrl(redirecUri,{
            scope:['basic','likes'],
            state: 'your state'
        })
    );
});

// ruta que tiene los datos de instagram

router.get('/handleauth',async (req,res)=>{
    try{
        const code = req.query.code;
        const data = await instagram.authorizeUser(code,redirecUri);
        
        // almacenar en la sesion
        req.session.access_token = data.access_token;
        req.session.user_id = data.user.id;
        
        instagram.config.accessToken = req.session.access_token;
        /* console.log(instagram)
        res.json(data); */
        res.redirect('/profile');

    }
    catch(e){
        res.json(e);
    }

});

// ruta para la vista después de haberse logeado

router.get('/profile',async(req,res)=>{

    try{
        const userData = await instagram.get('users/self');
        const media = await instagram.get('users/self/media/recent');
        res.render('profile',{user:userData.data , posts:media.data});
    }
    catch(e){
        console.log(e)
    }
});


router.get('/logout',(req,res)=>{
    delete req.session.access_token;
    delete req.session.user_id;
    res.redirect('/');
})


module.exports = router;