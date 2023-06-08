var logo = "./visilogo.png";

function main() {
  return (
    <div className="flex flex-col col-2 items-center justify-center mt-[10%] text-center   ">
      <h1 className="mt-8 text-4xl text-start font-bold">Welcome to <span className="text-sky-500">Visi</span></h1>
      <div className="border     border-sky-200 rounded w-[30%] h-[15%] py-2 mx-auto bg-grey-200 shadow-lg  flex  text-start mt-8">
          <p className="mx-5">To get Started  browse your project directory!  
            <br/>
            <span className="mt-[10%]">You can edit this file at <span className="bg-sky-300 shadow-lg  rounded px-2">/views/main.jsx</span></span>
            
           </p>
        </div>
        <div className="border-2  border-slate-200 rounded  w-[30%] h-[15%] py-2 mx-auto bg-grey-200 shadow-lg  flex  text-start mt-8 hover:border-sky-500">
            <p className="mx-5"> <a href="https://postr-inc.gitbook.io/visi.js-docs/" className="text-slate-700">
                 <span className="text-lg text-dark font-bold"> Documentation &#x2192;</span>  
                 <br/>
                    <span className="text-sm text-dark font-bold">Learn more about Visi.js</span>
                </a>
            </p>
            <br/>
             
        </div>
    </div>
  );
}

 
