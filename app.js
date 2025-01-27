var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const fs = require("fs")

// package yang di gunakan untuk admin
const flash = require("connect-flash");
const session = require('express-session');
const fileUpload = require("express-fileupload");

var indexRouter = require('./routes/index');

// router api customer
const customerRouter = require('./routes/customer')
const usersRouter = require('./routes/users')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const addressRouter = require('./routes/address')
const transactionRouter = require('./routes/transaction')
const provinceRouter = require('./routes/province')
const cityRouter = require('./routes/cities')
const districtRouter = require('./routes/district')

const cekOngkirRouter = require('./routes/raja-ongkir');

// import view admin or router admin
const adminRouter = require('./routes/admin');

var app = express();
// Initialize CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup admin lte
app.use("/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: {} }));
app.use(flash());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
// add app use yang di gunakan admin

app.use('/', indexRouter);

// router api v1
app.get("/api/v1", (req, res) => {
  fs.readFile("config/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

// router api
app.use('/api/v1', customerRouter)
app.use('/api/v1', usersRouter)
app.use('/api/v1', productRouter)
app.use('/api/v1', cartRouter)
app.use('/api/v1', addressRouter)
app.use('/api/v1', transactionRouter)
app.use('/api/v1', provinceRouter)
app.use('/api/v1', cityRouter)
app.use('/api/v1', districtRouter)
// ongkir
app.use('/api/v1/cek-ongkir', cekOngkirRouter);

// cek url active
app.use(function (req, res, next) {
  res.locals.stuff = {
    url: req.originalUrl
  }
  next();
});
// router admin
app.use('/', adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
