const Nav = (props) => {
   

    return(

        <nav className="  ">
        <div className="max-w-7xl mx-auto mx-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start ms-5 h-16">
                <div className="flex items-center">
                    <img className="rounded" 
                    width={28} height={28}
                    src="./components/static/images/visilogo.png" alt="Workflow" />
                    <p className='text-white ml-2 fw-bold text-xl font-semibold '>Visi.js</p>
                    <p className='text-white ml-2 font-semibold text-sm bg-gray-800 px-2 py-1 rounded-md'>v1.0.1</p>
                    <div className=" ">
                        <div className="ml-10 flex items-baseline">
                          <a href="#/home"   className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium"
                          aria-label="Home"
                          >Home</a>
                          <a aria-label="documentation" href="https://postr-inc.gitbook.io/visi.js-docs/"  className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium">Docs</a>
                            <a aria-label="releases" href="#/release-cycle"  className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium">Releases</a>
                           
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </nav>
    )
}