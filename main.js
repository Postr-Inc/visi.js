const app = new ReactRouter()
lib("@tailwind/daisyui")
app.bindRoot("app")

app.root("/", (req, res) =>{
    dispose('./views/main.jsx', (Main) =>{
        res.title("Home")
        res.return()
        res.jsx(<Main />)
    })
})

app.on('/team', (req, res)=>{
    dispose('./views/team.jsx', (Team) =>{
        res.title("Team")
        res.return()
        res.jsx(<Team/>)
    })
})

app.on('/', (req, res)=>{
    dispose('./views/main.jsx', (Main) =>{
        res.title("Home")
        res.return()
        res.jsx(<Main/>)
    })
})

app.on("/releases", (req, res) =>{
    dispose('./views/releases.jsx', (Releases) =>{
        res.title("Releases")
        res.return()
        res.jsx(<Releases/>)
    })
})

app.on('/showcase', (req, res)=>{
    dispose('./views/showcase.jsx', (Showcase) =>{
        res.title("Showcase")
        res.return()
        res.jsx(<Showcase/>)
    })
})