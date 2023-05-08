const Nav = (props) => {
   

    return(

        <nav className="  ">
        <div className="max-w-7xl mx-auto mx-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start ms-5 h-16">
                <div className="flex items-center">
                    <img className="h-7 w-7 rounded" src="./components/static/images/visilogo.png" alt="Workflow" />
                    <p className='text-white ml-2 fw-bold text-xl font-semibold '>Visi.js</p>
                    <a className='text-white ml-2 font-semibold text-sm bg-gray-800 px-2 py-1 rounded-md'>v1.0.1</a>
                    <div className=" ">
                        <div className="ml-10 flex items-baseline">
                          <a href="#/home"   className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium">Home</a>
                          <a href="https://postr-inc.gitbook.io/visi.js-docs/"  className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium">Docs</a>
                            <a href="#/release-cycle"  className="text-white px-3 py-2 hover:text-green-500  rounded-md text-sm font-medium">Releases</a>
                           
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </nav>
    )
}