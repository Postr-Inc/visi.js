require('@tailwindcss/typography') // require tailwind css
require('./components/static/styles/app.css')
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

            <nav className="  ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-start ms-5 h-16">
                        <div className="flex items-center">
                            <img className="h-7 w-7 rounded" src="./components/static/images/visilogo.png" alt="Workflow" />
                            <p className='text-white ml-2 fw-bold text-xl font-semibold '>Visi.js</p>
                            <a className='text-white ml-2 font-semibold text-sm bg-gray-800 px-2 py-1 rounded-md'>v1.0.0</a>
                            <div className=" ">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="#" className="text-white px-3 py-2 hover:bg-slate-800  rounded-md text-sm font-medium">Home</a>
                                    <a href="#/tutorial" className="text-slate-500 hover:bg-slate-800  px-3 py-2 rounded-md text-sm font-medium">Tutorial</a>
                                    <a href="#" className="text-slate-500 px-3 py-2 hover:bg-slate-800 rounded-md text-sm font-medium">Api</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </nav>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 text-center">
                        <div className="text-center overflow-hidden shadow-sm sm:rounded-lg">
                            <p className='fw-bold text-6xl text-white mx-4 mt-6'>
                                Not a Framework, Just A Library!
                            </p>
                            <p className='text-slate-900 mt-12 text-lg'>
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
                            <button className='bg-white mx-2 text-slate font-5xl fw-bold    py-2 px-7  rounded shadow'>
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <p className='fw-bold text-4xl text-center text-slate-200'>Features</p>


                        <div className="flex flex-col items-center w-100 sm:flex-row">
                            <div className="text-slate-900 bg-slate-800 rounded py-4 px-6 mx-4  mt-12 text-lg">
                                <h2 className="text-white text-2xl font-bold mb-4">Visi React Router</h2>
                                <p className="text-gray-300 mb-6">With React Router, you can define routes that render different components based on the URL.
                                    Set cookies and query parameters in the URL to pass data between pages.
                                </p>

                                <button className='bg-slate-600 text-slate font-5xl fw-bold    py-2 px-12   rounded shadow'>
                                    Learn More
                                </button>

                            </div>
                            <div className="mx-5 text-slate-900 bg-slate-800 rounded py-4 mx-4 px-6 w-501/2 mt-12 text-lg">
                                <h2 className="text-white text-2xl font-bold mb-4">Parallel Caching</h2>
                                <p className="text-gray-300 mb-6">Visi.js x Lazyjs class methods allow you to cache the same data or different datasets accross multiple shards
                                    no need to refetch the data when you can cache and query the data from the cache
                                </p>
                                <br></br>
                                <button className='bg-slate-600 text-slate font-5xl fw-bold    py-2 px-12   rounded shadow'>
                                    Learn More
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            <footer className="w-full py-8  ">
  <div className="max-w-screen-xl mx-auto px-4">
    <div className="flex   justify-between">
      <div className="flex items-center">
        <img className="h-8 w-8 rounded mr-2" src="./components/static/images/visilogo.png" alt="Visi.js Logo" />
        <p className="text-white text-xl font-bold">Visi.js</p>
         
      </div>
      
      
      <div>
      <div className="flex float-right  ">
        <i class="fa-brands text-white text-2xl fa-github"></i>
        <i class="fa-brands text-white text-2xl fa-discord mx-6"></i>
        <i class="fa-brands text-white text-2xl fa-twitter mx-5"></i>
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
