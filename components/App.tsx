require('@tailwindcss/typography') // require tailwind css
require('./components/static/styles/app.css')
let Nav = require('./components/Nav.tsx')
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
                            <p style={{ margin: "auto", width: "75%" }} className='fw-bold text-6xl text-white mx-4 mt-6'>
                                Not a Framework, Just A Library!
                            </p>
                            <p style={{ margin: "auto", width: "75%", marginTop: "30px" }} className='text-slate-900 mt-12 text-lg'>
                                Visi.js is a library that streamlines the development of single-page applications by abstracting away complexity and enabling multi-page functionality
                            </p>

                        </div>
                    </div>
                    <div className="px-4 py-6 sm:px-0 text-center">
                        <div className="text-center overflow-hidden shadow-sm sm:rounded-lg">
                            <button
                                ref={btncopy}
                                onClick={() => {
                                    navigator.clipboard.writeText('npm i visi.js')
                                    setCopied(true)

                                }}

                                className='bg-white text-slate font-5xl fw-bold    py-2 px-7   rounded shadow'>
                                📋 npm i visi.js
                            </button>
                            <button onClick={()=> window.location.hash="#/about"} className='bg-white mx-2 text-slate font-5xl fw-bold    py-2 px-7  rounded shadow'>
                                Learn More
                            </button>
                            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                <p className="text-white mt-20 justify-center text-center fw-bold text-2xl">
                                    Works With
                                </p>
                                <div
                                    style={{ marginTop: "1em" }}
                                    className="flex justify-center space-x-12 "
                                >
                                    <div className="mt-12">
                                        <p className="text-white text-2xl mt-2">
                                            <i className="fab fa-react text-blue-500 text-3xl inline-block"></i> React
                                        </p>
                                        <p className="text-slate-400  mt-2">
                                            Visi.js integrates seamlessly with your existing React workflows, making it easy to get started.
                                        </p>
                                    </div>
                                    <div className="mt-12">
                                        <p className="text-white text-2xl mt-2">
                                            <img loading="lazy"src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg" alt="Tailwind CSS" className="h-12 mx-3 w-12 inline-block" /> Tailwind CSS
                                        </p>

                                        <p className="text-slate-400 mt-2">
                                            Visi.js is compatible with Tailwind CSS, allowing you to quickly and easily create beautiful, responsive designs.
                                        </p>
                                    </div>
                                    <div className="mt-12">
                                        <p className="text-white text-2xl mt-2">
                                            <img loading="lazy"loading="lazy" src="https://img.icons8.com/?size=512&id=wpZmKzk11AzJ&format=png" alt="TypeScript" className="h-12 mx-3 w-12 inline-block" /> TypeScript
                                        </p>
                                        <p className="text-slate-400 mt-2">
                                            Visi.js is includes ts types and tsx support, allowing you to quickly and easily create beautiful, responsive designs.
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
                            <img loading="lazy"className="h-8 w-8 rounded mr-2 mx-4" src="./components/static/images/visilogo.png" alt="Visi.js Logo" />
                        </div>


                        <div>
                            <div className="flex float-right  ">
                                <i className="fa-brands text-white text-2xl fa-github"></i>
                                <i className="fa-brands text-white text-2xl fa-discord mx-6"></i>
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
