const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);
const Book = require('./models/Book');
const User = require('./models/User');
const Rental = require('./models/Rental');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', { index: false }));
app.use('/public', express.static(__dirname + '/public'));

// ---- DB Config ----
const dbString = process.env.URL;
const dbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};
mongoose.connect(dbString, dbOptions);

// ---- SESSION CONFIG ----
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.createConnection(dbString, dbOptions),
  collection: 'sessions'
});
app.use(session({
  name: process.env.NAME,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'strict'
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---- DASHBOARD ROUTES ----
// INDEX - show dashboard info
app.get('/api/dashboard', isAdmin, (req, res) => {
  Book.find({}).then(books => {
    User.find({}).then(users => {
      Rental.find({}).then(rentals => {
        res.send({
          books: books.length,
          users: users.length - 1,
          rentals: rentals.length
        });
      });
    });
  });
});

// ---- BOOK ROUTES ----
// INDEX - show all books
app.get('/api/books', (req, res) => {
  Book.find({}).then(books => {
    res.send(books);
  });
});

// SEARCH - search books
app.get('/api/books/search', (req, res) => {
  let availability = '';
  if (req.query.availability == 1) availability =  { $gte: 1 };
  else if (req.query.availability == 0) availability = { $lte: 0 };
  let query = {
    name: new RegExp(req.query.name),
    author: new RegExp(req.query.author),
    published: { $gt: req.query.dateFrom - 1, $lt: Number(req.query.dateTo) + 1 },
    availability: availability,
    type: new RegExp(req.query.type),
    lang: new RegExp(req.query.lang)
  }
  if (req.query.dateFrom == '') query.published = { $gt:  0, $lt: Number(req.query.dateTo) + 1 };
  if (req.query.dateTo == '') query.published = { $gt: req.query.dateFrom - 1, $lt: 9999 };
  if (req.query.dateFrom == '' && req.query.dateTo == '') query.published = { $gt: 0, $lt: 9999 };
  if (req.query.availability == '') delete query.availability;
  Book.find(query).then(books => {
    res.send(books);
  });
});

// READ - get specific book
app.get('/api/books/:id', (req, res) => {
  Book.findById(req.params.id).then(book => {
    res.send(book);
  });
});

// CREATE - add new book to db
app.post('/api/books', isAdmin, (req, res) => {
  if (isBookValid(req)) {
    let book = new Book({
      name: req.body.name,
      author: req.body.author,
      published: req.body.published,
      cover: req.body.cover,
      desc: req.body.desc,
      type: req.body.type,
      availability: req.body.availability,
      lang: req.body.lang
    });
    book.save().then(() => {
      if (book.isNew == false) res.send('Saved!');
      else res.send('Failed to save data!'); 
    });
  } else res.send('Failed to save data!');
});

// UPDATE - update particular book
app.put('/api/books/:id', isAdmin, (req, res) => {
  if (isEditedBookValid(req)) {
    Book.findOneAndUpdate({ _id: req.params.id }, clean(req.body), err => {
      if (err) res.send('Failed: ' + err);
    });
    res.send('Updated!');
  } else res.send('Failed to save data!');
});

// DELETE - delete book from db
app.delete('/api/books/:id', isAdmin, (req, res) => {
  Rental.deleteMany({ book: { _id: req.params.id } }, err => {
    if (err) console.log(err);
    Book.findOneAndDelete({ _id: req.params.id }, err => {
      if (err) console.log(err);
      res.send('Deleted!');
    });
  });
});

// ---- USER ROUTES ----
// INDEX - show all users
app.get('/api/users', isAdmin, (req, res) => {
  User.find({}).then(users => {
    res.send(users);
  });
});

// READ - get specific user
app.get('/api/users/:id', isAdmin, (req, res) => {
  User.findById(req.params.id).then(user => {
    res.send(user);
  });
});

// DELETE - delete user from db
app.delete('/api/users/:id', isAdmin, (req, res) => {
  Rental.deleteMany({ user: { _id: req.params.id } }, err => {
    if (err) console.log(err);
    User.findOneAndDelete({ _id: req.params.id }, err => {
      if (err) console.log(err);
      res.send('Deleted!');
    });
  });
});

// ---- RENTAL ROUTES ----
// INDEX - show all rentals
app.get('/api/rentals/', (req, res) => {
  Rental.find({}).populate('user').populate('book').then(rentals => {
    res.send(rentals);
  });
});

// READ - get specific rental
app.get('/api/rentals/:id', isAdmin, (req, res) => {
  Rental.findById(req.params.id).populate('user').populate('book').then(rental => {
    res.send(rental);
  });
});

// CREATE - add new rental to db
app.post('/api/rentals', isAdmin, (req, res) => {
  if (isRentalValid(req)) {
    Book.findOne({ name: req.body.bookName }).then(book => {
      if (book !== null && book.availability > 0) {
        Book.findByIdAndUpdate(book._id, { $inc: { availability: -1 } }).then(book => {
          User.findOneAndUpdate({ name: req.body.name, surname: req.body.surname, no: req.body.no }, { $inc: { rented: 1 } }).then((user) => {
            if (user !== null) {
              let rental = new Rental({
                user: user,
                book: book,
                rental_date: new Date(),
                return_date: null
              });
              rental.save().then(() => {
                if (rental.isNew == false) res.send('Saved!');
              });
            } else res.send('Failed to save data!');
          });
        }); 
      } else res.send('Failed to save data!');
    });
  } else res.send('Failed to save data!');
});

// UPDATE - update particular rental
app.put('/api/rentals/:id', isAdmin, (req, res) => {
  Rental.findOneAndUpdate({ _id: req.params.id }, { return_date: req.body.return_date }).then(rental => {
    Book.findOneAndUpdate({ _id: rental.book._id }, { $inc: { availability: 1 } }, err => {
      if (err) console.log(err);
      else res.send('Updated!');
    });
  });
});

app.get('/api/rentals/user/:id', (req, res) => {
  Rental.find({ user: req.params.id }).populate('book').then(rentals => {
    res.send(rentals);
  });
});

// ---- AUTH ROUTES ----
// REGISTER - add new user to db
app.post('/api/register', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) console.log(err);
    else if (user == null) {
      User.register(new User({ 
        name: req.body.name,
        surname: req.body.surname,
        no: req.body.no,
        username: req.body.username,
        email: req.body.email,
        rented: 0,
        role: 'USER'
      }), 
      req.body.password, err => {
        if (err) console.log(err);
        passport.authenticate('local')(req, res, () => {
          return res.send({ id: req.user._id, username: req.user.username });
        });
      });
    } else res.send({ message: 'Użytkownik o podanej nazwie już istnieje.' });
  });
});

// LOGIN - login to service
app.get('/login', isNotLoggedIn, (req, res) => {
  res.sendFile(path.resolve('public', 'login.html'));
});

app.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    else if (!user) return res.redirect('/login');
    req.logIn(user, err => {
      if (err) return next(err);
      else if (req.user.role === 'ADMIN') return res.redirect('/');
      return res.redirect('/logout');
    });
  })(req, res, next);
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    else if (!user) return res.send({ message: 'Dane logowania są niepoprawne.' });
    req.logIn(user, err => {
      if (err) return next(err);
      return res.send({ id: req.user._id, username: req.user.username });
    });
  })(req, res, next);
});

// LOGOUT - logout of the service
app.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie(process.env.NAME);
    return res.redirect('/login');
  });
});

app.get('/api/logout', (req, res) => {
  req.logOut();
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie(process.env.NAME);
  });
});

// ---- OTHER ----
// MAIN - show main route
app.get('/*', isAdmin, (req, res) => {
  const url = req.url;
  if (url === '/' || url === '/books' || url === '/users' || url === '/rentals') return res.sendFile(path.resolve('public', 'index.html')); 
  else return res.redirect('/');
});
app.listen(process.env.PORT);

// MIDDLEWARE - additional functionality
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/login");
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  else res.redirect("/");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') return next();
  else res.redirect("/login");
}

function isBookValid(req) {
  let flag = true;
  const { published, availability } = req.body;
  if (!Number.isInteger(published) || !Number.isInteger(availability)) flag = false;
  Object.values(req.body).forEach(value => {
    if (value === null || value === '') {
      flag = false;
      return;
    }
  });
  return flag;
}

function isEditedBookValid(req) {
  let flag = true;
  const { published, availability } = req.body;
  if ((!Number.isInteger(published) && published !== null) || (!Number.isInteger(availability) && availability !== null)) flag = false;
  return flag;
}

function isRentalValid(req) {
  let flag = true;
  if (!Number.isInteger(req.body.no)) flag = false;
  Object.values(req.body).forEach(value => {
    if (value === null || value === '') {
      flag = false;
      return;
    }
  });
  return flag;
}

function clean(obj) {
  for (let propName in obj) {
    if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) delete obj[propName];
  }
  return obj;
}