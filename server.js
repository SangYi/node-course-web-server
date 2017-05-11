const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;  //NOTE store port from heroku or whereever.  Local default set to 3000
let app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');  //sets various express related configs

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log.')
    }
  });
  next();//NOTE next needs to be called to tell express tha tmiddleware function has been completed
})

app.use((req, res, next) => {
  res.render('maintainance.hbs', {
    pageTitle: "We'll be right back!",
    welcomeMessage: "The site is currently being updated."
  })
})

app.use(express.static(__dirname +'/public'));  //app.use - how you registers middleware


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
})
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Sang',
  //   likes:[
  //     'music',
  //     'games'
  //   ]
  // });
  //NOTE .render is gong to let you render any of the templates you set up
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    // currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome to the Homepage',
  });
});

app.get('/about', (req, res) => {
  // res.send('<h1>About Page</h1>')
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear(),
  });
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
})

app.listen(port, ()=>{
  console.log(`Server is up on port ${port}!`);
});
