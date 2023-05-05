ErrorTrace()
const app = new ReactRouter()
app.bindRoot("app")
prefetch("./js/prefetch.json")
let App = require('./components/App.jsx')
let About = require('./components/About.jsx')
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

app.on("/about", function(req, res) {
    res.title('Visi.js - About')
    res.return()
    res.jsx(<About />)
    res.return()
})