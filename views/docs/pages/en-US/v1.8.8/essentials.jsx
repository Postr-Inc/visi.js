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
         <a className="link mx-2"  href={`#/docs/${lang}/v1.8.8/dispose`}>  
          Learn more about dispose
         </a>
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
  <pre className="text-slate-500">
    <code>// index.jsx</code>
  </pre>
  <pre className="text-slate-500">
    <code>
      // useState is a global hook binded to window
    </code>
  </pre>
  <pre className="text-slate-900 px-5">
    <code>
      let [app, setApp] = useState(null)
      <br />
      <br />
      useEffect(() =&gt; &#123;
        dispose('./path/to/App.jsx', (App) =&gt; &#123;
          setApp(&#60;App /&#62;)
        &#125;)
      &#125;, [])
      <br />
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

            <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded text-sm mt-5">
  <pre data-prefix="1">
    <code className="mx-5 py-5">const app = new ReactRouter()</code>
  </pre>
  <br />
  <pre data-prefix="2">
    <code className="mx-5 py-5">app.bindRoot(`Any element Id that you want to render to!`)</code>
  </pre>
  <br />
  <pre data-prefix="3">
    <code className="mx-5 py-5">// Set routes</code>
  </pre>
  <br />
  <pre data-prefix="4">
    <code className="mx-5 py-5">app.use('/')</code>
  </pre>
  <br />
  <pre data-prefix="5">
    <code className="mx-5 py-5">app.use('/about')</code>
  </pre>
  <br />
  <pre data-prefix="6">
    <code className="mx-5 py-5">app.root('/about', (req, res) =&gt; &#123;</code>
  </pre>
  <pre data-prefix="7">
    <code className="mx-5 py-5">  res.send('root route') {/* Render a component */}</code>
  </pre>
  <pre data-prefix="8">
    <code className="mx-5 py-5">&#125;)</code>
  </pre>
  <br />
  <pre data-prefix="9">
    <code className="mx-5 py-5">app.get('/', (req, res) =&gt; &#123;</code>
  </pre>
  <pre data-prefix="10">
    <code className="mx-5 py-5">  res.send('Hello World')</code>
  </pre>
  <pre data-prefix="11">
    <code className="mx-5 py-5">  {/* res.jsx(some component) - res.sendStatus / sendFile */}</code>
  </pre>
  <pre data-prefix="12">
    <code className="mx-5 py-5">&#125;)</code>
  </pre>
  <br />
  <pre data-prefix="13">
    <code className="mx-5 py-5">app.error((res) =&gt; &#123;</code>
  </pre>
  <pre data-prefix="14">
    <code className="mx-5 py-5">  res.send('404')</code>
  </pre>
  <pre data-prefix="15">
    <code className="mx-5 py-5">&#125;)</code>
  </pre>
</div>

               

        
        <div className="flex flex-row  mt-5 gap-2">
        <a
          href={`#/docs/${lang}/v1.8.8/intro`}
          className="btn    mt-5"
         
        >
           Previous: Introduction
        </a>
        <a
          href={`#/docs/${lang}/v1.8.8/dispose`}
          className="btn    mt-5"
         
        >
          Next: API Reference - Dispose()
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
  