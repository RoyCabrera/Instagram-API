const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require('path');
const session = require('cookie-session');

const express = require('express');
const app = express();

// SETTINGS
app.set('port',process.env.PORT || 3000);

// SETTINGS VIEWS

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// MIDDLEWARES

app.use(morgan('dev'));

app.use((req,res,next)=>{
    res.locals.formatDate = (date) => {
        let myDate = new Date(date * 1000);
        return myDate.toLocaleString();
    };
    next();
});

app.use(session({
    secret:'mysecretword',
    signed:true
}))

//ROUTES
const route = require('./routes/index');
app.use(route);

// Empezando el servidor
app.listen(app.get('port'),()=>{
    console.log("listo en el puerto:", app.get('port'));
});


