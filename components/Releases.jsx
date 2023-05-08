let Nav = require('./components/Nav.jsx');
function Releases() {
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
                    <div className="px-4 py-6 sm:px-0  ">
                        <div className="overflow-hidden shadow-sm sm:rounded-lg">
                            <p style={{ margin: "auto", width: "75%", color: '#1ae0a2' }} className='fw-bold text-2xl   mx-4 mt-6'>
                                Releases
                            </p>
                            <p style={{ margin: "auto", width: "75%", marginTop: "30px", color: '' }} className='text-slate-400 mt-12 text-lg'>
                                Latest version of visi is <span className='text-slate-300'>1.4.2</span>
                            </p>
                            <p style={{ margin: "auto", width: "75%", marginTop: "30px", color: '' }} className='text-slate-400 mt-5 text-lg'>
                                <br></br>
                                <span className='fw-bold text-white text-2xl'>
                                    Release Cycle
                                </span>


                                <ul className='list-disc '>

                                    <li className='text-slate-300 mt-2'>Major releases are released when something outstanding is implemented</li>

                                    <li className='text-slate-300 mt-2'>Minor releases are releases are usually small improvements.</li>
                                </ul>
                                <br></br>
                                <span className='fw-bold text-white mt-12 text-2xl'>
                                    Backwards Compatibility
                                </span>
                                <p>Applications using new versions of visi may not be backwards compatible, that is why we say weigh updates before changing versions!</p>
                                <p className='mt-2'>Example: An app running v1.0.5 will not work with 1.4.2 because their were 35 changes in between that fix alot of issues it had!</p>
                                <br></br>
                                <span className='fw-bold text-white mt-12 text-2xl'>
                                      Deprecations
                                 </span>
                                    <p>We may deprecate features, that we find affect the performance of the webpage, or we find a better simpler solution that improves it drastically!</p>
  
                            </p>
                            <br></br>


                        </div>
                    </div>


                </div>

            </main>

            <footer className="w-full py-8  py-16  bottom-0  ">
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
