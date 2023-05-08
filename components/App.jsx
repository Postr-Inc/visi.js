let Nav = require('./components/Nav.jsx')
function App() {
    const btncopy = useRef(null)
    const [copied, setCopied] = useState(false)
    useEffect(() => {
        if (copied) {
            btncopy.current.innerText = 'Copied!'
            setTimeout(() => {
                btncopy.current.innerText = '📋 npm i visi.js'
                btncopy.current.style.backgroundColor = 'white'
                setCopied(false)
            }, 2000)
        }
    }, [copied])

    console.log('App component');
    return (
        <div>
            {/*navbar mobile*/}

            <Nav />


            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 text-center">
                        <div className="text-center overflow-hidden shadow-sm sm:rounded-lg">
                            <p style={{ margin: "auto", width: "75%", color:'#1ae0a2' }} className='fw-bold text-6xl   mx-4 mt-6'>
                                Not a Framework, Just A Library!
                            </p>
                            <p style={{ margin: "auto", width: "75%", marginTop: "30px", color:'' }} className='text-slate-400 mt-12 text-lg'>
                               An easy peformant all in one solution for building single page applications with the power of multi page functionality.
                            </p>

                        </div>
                    </div>
                    <div className="px-4 py-6 sm:px-0 text-center">
                        <div className="text-center overflow-hidden shadow-sm sm:rounded-lg">
                            <button style={{backgroundColor:'#8affda'}} className='py-2 px-10 rounded fw-bold'>
                                Why Visi</button>
                            <button onClick={()=> window.location.href="https://postr-inc.gitbook.io/visi.js-docs/"} className='bg-white mx-2 text-slate font-5xl fw-bold    py-2 px-7  rounded shadow'>
                                Learn More
                            </button>
                            <div className="max-w-4xl mt-16 mx-auto text-start justify-center py-6 sm:px-6 lg:px-8">
                                 
                                <div
                                    style={{ marginTop: "1em" }}
                                    className="flex justify-center space-x-12 "
                                >
                                    <div className="mt-12">
                                        <p className='text-start fw-bold text-white  text-xl'>⚡Fast</p>
                                        <p className="text-slate-400   mt-2">
                                           Optimized for a smaller build size, faster dev compilation and dozens of other improvements.
                                        </p>
                                    </div>
                                    <div className="mt-12">
                                        
                                        <p className='text-start fw-bold text-white  text-xl'>📦 Easy to use</p>
                                        <p className="text-slate-400 mt-2">
                                            visi is designed to be as easy to use as possible. It's as simple as importing the library and using it.
                                        </p>
                                    </div>
                                    <div className="mt-12">
                                        <p className='text-start fw-bold text-white  text-xl'>📚 Documentation</p>
                                        <p className="text-slate-400 mt-2">
                                            Visi.js has a comprehensive documentation that covers all the features of the library.
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                            

                        </div>
                    </div>

                </div>

            </main>

            <footer className="w-full py-8   bottom-0  ">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="flex   justify-between">
                        <div className="flex items-center">
                            <p className="text-white text-xl font-bold">Built With</p>
                            <img loading="lazy" className="h-8 w-8 rounded mr-2 mx-4" src="./components/static/images/visilogo.png" alt="Visi.js Logo" />
                        </div>


                        <div>
                            <div className="flex float-right  ">
                                <a href='https://github.com/Postr-Inc/visi.js'><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                width={30} height={30} className="rounded-full" />
                                </a>
                                
                                <a href='https://discord.gg/RGYQKENTRk'>
                                    <img src="https://img.icons8.com/?size=512&id=Mk8iYNRHUM8y&format=png"
                                    width={38} height={38} className="rounded-full mx-5" />

                                </a>
                                <i className="fa-brands text-white text-2xl fa-twitter mx-5"></i>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-between mt-8">
                        <div className="flex items-center">
                            <p className="text-white text-sm font-semibold">© 2023 Visi.js All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>


        </div>



    )
}
