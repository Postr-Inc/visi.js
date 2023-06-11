const lib = () => {
    const lang = localStorage.getItem('lang') || 'en-US';
    window.postMessage(
      {
        page: 'lib',
        lang: lang,
        pageContent: [
          {
            title: 'lib',
            mainContent: 'lib() function',
            subContent: ['libManager'],
          },
        ],
      },
      '*'
    );
  
    return (
      <div className="w-full">
        <h1 data-scroll-target="lib" className="text-4xl text-slate-800 font-bold">
          lib() function
        </h1>
        <div className="divider"></div>
        <p className="mt-5">
          The Lib() function provides libraries to load into your application that work with Visi. 
          <br></br>
          how it works - if cfr is enabled it first uses cdn to show intial site  (old way) then it caches the library code and uses it on the next load and so on.
          it also helps with blocking time with the new lib 2.0 from further versions blocking time is now 0ms with both cfr on and off! and 0 layout shift.
            lib does not need to be imported you can just use it anywhere since it is a global function.
        </p>
        <div className="divider"></div>
  
        <div data-scroll-target="parameters">
        <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
          <pre data-prefix="1">
            <code className="mx-5 py-5">lib('@tailwind/daisyui@version')</code>
          </pre>
          <pre data-prefix="2">
            <code className="mx-5 py-5">lib('@tailwind/core/plugins')</code>
          </pre>
          <pre data-prefix="2">
            <code className="mx-5 py-5">lib('@bootstrap/core@version')</code>

          </pre>
          <pre data-prefix="3">
            <code className="mx-5 py-5">lib('@bootstrap/icons')</code>
            
          </pre>
          <pre data-prefix="3">
            <code className="mx-5 py-5">lib('@d3.js')</code>
            
          </pre>
          <pre data-prefix="3">
            <code className="mx-5 py-5">lib('@canvas.js')</code>
            
          </pre>
          <pre data-prefix="3">
            <code className="mx-5 py-5">lib('@three.js')</code>
            
          </pre>
        </div>
        </div>
        <div className="divider"></div>
        <h2 data-scroll-target="libManager" className="text-2xl mt-5  mb-5 text-slate-800 font-bold">
            libManager
        </h2>
        <p>
            libManager is a global function that allows you to manage libraries in your application. It helps you remove, list and remove all libraries in your application.
        </p>
        <p className="mt-5">Parameters:</p>
        <ul className="mt-5 list-disc py-5">
            <li>
                <code>libManager.listModules()</code> (string): Lists all modules your application uses.
            </li>
            <li>
                <code>libManager.clearModule(modulename) </code> (string): Removes a module from your application.
            </li>
            <li>
                <code>libManager.clearAll()</code> (string): Removes all modules from your application.
            </li>
        </ul>
         
        <div className="flex flex-row  mt-5 gap-2">
          <a
            href={`#/docs/${lang}/v1.8.8/dispose`}
            className="btn    mt-5"
           
          >
             Previous: dispose()
          </a>
          <a
       
            href={`#/docs/${lang}/v1.8.8/filesystem`}
            className="btn    mt-5"
           
          >
            Next: API Reference - FS()
          </a>
          </div>
    
          <p className="fixed bottom-5 right-5 text-slate-300 flex">
            <img
              src="https://avatars.githubusercontent.com/u/65188863?v=4"
              className="w-5 h-5 rounded-full me-5"
              alt="avatar"
            />
            Last Edited 6/10/23
          </p>
        
      </div>
    );
  }
   
  