ErrorTrace()
const app = new ReactRouter()
app.bindRoot("app")

 
app.onload(function() {
    app.root("/", function(req, res) {
        let App = require('./components/App.tsx')
        res.title('Visi.js')
        res.return()
        res.jsx(<App />)
        res.return()
    })
    
    app.on("/home", function(req, res) {
        let App = require('./components/App.tsx')
        res.title('Visi.js')
        res.return()
        res.jsx(<App />)
        res.return()
    })
    
    app.on("/about", function(req, res) {
        let About = require('./components/About.tsx')
        res.title('Visi.js - About')
        res.return()
        res.jsx(<About />)
        res.return()
    })
})