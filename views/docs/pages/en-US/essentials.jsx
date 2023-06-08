function essentials() {
    let lang = window.location.hash.split('/')[2];
    window.postMessage(
      {
        page: 'intro',
        lang: lang,
        pageContent: [
          {
            title: 'Essentials',
            mainContent: 'Creating an Application',
            subContent: ['Routing'],
          },
        ],
      },
      '*'
    );
  
    return (
      <div className="w-full">
        <h1
          data-scroll-target="Creating an Application"
          className="text-4xl text-slate-800 font-bold"
        >
          Creating an Application
        </h1>
  
        <div className="divider"></div>
  
        <p>
          Creating an app in Visi is pretty simple, but there are tradeoffs to how you import components. Visi uses a different approach. Visi uses a global function called "dispose."
          <br />
          Dispose compiles your code on a service worker, then awaits the component to be fully loaded to render it. By taking this approach, we were able to reduce the blocking time using React CDN with Babel from 120 seconds to 0.5 seconds.
          <br />
          Unlike Node React, dispose components must have the same function name as the file name. This is because dispose uses the function name to render the component and helps with confusion.
        </p>
  
        <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded text-sm mt-5">
          <pre data-prefix="1" className="text-slate-500">
            <code>// App.jsx</code>
          </pre>
          <pre data-prefix="2" className="text-slate-900">
            <code>function App(props) &#123;</code>
            <br />
            &nbsp; &nbsp; &nbsp; return &#60;div&#62;Hello World  &#60;/div&#62;
            <br />
            &nbsp; &nbsp; &#125;
          </pre>
        </div>
  
       <p className="mt-5">
        And in your index.jsx file, you can import the component like so:
        </p>
       <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded text-sm mt-5">
            <pre   className="text-slate-500">
                <code>// index.jsx</code>
            </pre>
            <pre   className="text-slate-500">
                <code>
                // useState is a global hook binded to window
                <br />
                </code>
            </pre>
            <pre   className="text-slate-900  px-5">
                <code>
                     
                    
                    <br></br>
                    let [app, setApp] =  useState(null)
                    <br />
                </code>
                <code>
                    <br />
                 useEffect(()=&gt; &#123;
                    <br />
                    dispose('./path/to/App.jsx', (App)=&gt; &#123;
                     setApp(&#60;App /&#62;)
                    &#125;)
                    <br />
                    &#125;, [])
                </code>
                <code>
                    <br />
                    return &#60;div&#62;&#123;app&#125;&#60;/div&#62;

                </code>
                
            </pre> 
            </div>

            <div className="divider"></div>
            <h1
            data-scroll-target="Routing"
            className="text-4xl text-slate-800 font-bold"
            >
            Routing
            </h1>
            <p className="mt-5">
                Visi offers both a hash router and a history router. The hash router is the default router and is recommended for most applications. The history router is recommended for applications that require a server.
                Visi hash router tries to mimic syntax of Express.js by allowing router params queries and more!
                Here is an example of a hash router:
            </p>

            
            <div className="mockup-code bg-slate-100 text-slate-900 w-54 border-0 rounded text-sm mt-5 px-5">
            <pre   className="text-slate-900">
                <code>
                    
                    <br />
                    const app = new ReactRouter()
                    <br />
                    <br />
                    app.bindRoot(`Any element Id that you want to render to!`)
                    <br />
                    <span className="text-slate-400">// Set routes</span>
                    <br />
                    app.use('/')
                    <br />
                     
                    app.use('/about')
                    <br />
                    <br />
                    app.root('/about', (req, res)=&gt; &#123;
                    <br />
                    <br />
                    &nbsp; &nbsp; &nbsp; res.send('root route') // Render a component
                    <br />
                    &#125;)
                    <br />
                    <br />
                    app.get('/', (req, res)=&gt; &#123;
                    <br />
                    res.send(Hello World)
                    // res.jsx(some component) - res.sendStatus / sendFile
                    <br />

                    &#125;)

                    <br />
                    <br />
                    app.error((res)=&gt; &#123;
                    
                    <br />
                    
                    &nbsp; &nbsp; &nbsp; res.send('404')
                    <br />
                    &#125;)

                </code>
                </pre>
                </div>
               

        
        <div className="tooltip" data-tip="Disabled until someone  makes this page!">
        <a
          href={`#/docs/${lang}/creating-an-application`}
          className="btn    mt-5"
          disabled
        >
          Next: Api Reference
        </a>
        </div>
  
        <p className="fixed bottom-5 right-5 text-slate-300 flex">
          <img
            src="https://avatars.githubusercontent.com/u/65188863?v=4"
            className="w-5 h-5 rounded-full me-5"
            alt="avatar"
          />
          Last Edited 6/7/23
        </p>
      </div>
    );
  }
  