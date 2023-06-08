const app = new ReactRouter()
lib("@tailwind/core")
// specify a route
app.use('/helloworld')
app.use('/')
app.bindRoot("app")

// set root initial route
app.root("/", (req, res) =>{
    dispose('./views/main.jsx', (Main) =>{
        res.jsx(<Main />)
        res.return()
    })
})
// bind actions to the route
app.get('/helloworld', (req, res) =>{
    res.send("Hello World")
    res.return()
})
 
// if route not found return 404
app.error((res)=>{
    res.send("404")
    res.return()
})