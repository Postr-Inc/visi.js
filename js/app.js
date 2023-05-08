ErrorTrace()
const app = new ReactRouter()
app.bindRoot("app")
let App = require('./components/App.jsx')
let Releases = require('./components/Releases.jsx')
require('@tailwindcss/typography') // require tailwind css
require('./components/static/styles/app.css')
app.root("/", function(req, res) {
    res.title('Visi.js')
    res.return()
    res.jsx(<App />)
    res.return()
})

app.on("/home", function(req, res) {
    res.title('Visi.js')
    res.return()
    res.jsx(<App />)
    res.return()
})

app.on("/release-cycle", function(req, res) {
    res.title('Visi.js - releases')
    res.return()
    res.jsx(<Releases />)
    res.return()
})

 
