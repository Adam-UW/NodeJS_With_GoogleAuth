const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan= require('morgan')
const exphbs = require('express-handlebars')
const passport= require('passport')
const mongoose= require('mongoose')
const session = require('express-session')
const MongoStore= require('connect-mongo')(session)
const connectDB= require('./config/db')

//Load config 
dotenv.config({path:'./config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// HandleBars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')


// Sessions 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, // Do not create a session until something stores
    store: new MongoStore({mongooseConnection: mongoose.connection})
    // cookie: {secure: true}
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT= process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})