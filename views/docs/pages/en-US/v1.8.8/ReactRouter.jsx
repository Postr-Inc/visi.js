function ReactRouter(){
    const lang =  localStorage.getItem('lang') || 'en-US';
    window.postMessage(
        {
          page: 'intro',
          lang: lang,
          pageContent: [
            {
              title: 'ReactRouter',
              mainContent: 'Use of ReactRouter',
              subContent: ['parameters', 'methods', 'good practices', 'examples'],
            },
          ],
        },
        '*'
      );
      return(
            <div className="w-full">
            <h1
                data-scroll-target="Use of ReactRouter"
                className="text-4xl text-slate-800 font-bold"
            >
                ReactRouter
            </h1>
            <div className="divider"></div>
            <p>
                ReactRouter is a express like router for Visi. It is used to create dynamic param/query routes for you spa applications
                It provides several methods which we will go over in this documentation, aswell as some good practices and show a few examples!
            </p>
            <div className="divider"></div>
            <h1 className="text-4xl text-slate-800 font-bold mt-10"
                data-scroll-target="parameters"
            >Parameters</h1>
            <p className="mt-5">
                when intializing the react router you must set #1 the root element for rendering #2 the routes you want to use for your application #3 and the root base route
                to fallback to,  these are crucial to let
                the router know where and what to render! Below is an example of how to initialize the router and set the root element and routes.
            </p>
            <div className="mockup-code bg-slate-100 text-slate-800 w-54 border-0 rounded  text-sm mt-5">
                <pre data-prefix="1" ><code>const app = new ReactRouter()</code></pre>
                <pre data-prefix="2" ><code>app.bindRoot(`Any element Id that you want to render to!`)</code></pre>
                <pre data-prefix="3" ><code>// Set routes</code></pre>
                <pre data-prefix="4" ><code>app.use('/')</code></pre>
                <pre data-prefix="5" ><code>app.use('/about')</code></pre>
                <pre data-prefix="6" ><code>app.use('/contact')</code></pre>
                <pre data-prefix="7" ><code className="text-slate-500">// Render a component</code></pre>
                <pre data-prefix="8" ><code>app.root('/about', (req, res) =&gt; &#123;</code></pre>
                <pre data-prefix="9" ><code>  res.send('root route')
                    res.return() 
                    </code></pre>
                <pre data-prefix="10" ><code>&#125;)    <br></br></code></pre>
                <pre data-prefix="11" ><code>app.get('/', (req, res) =&gt; &#123;</code></pre>
                <pre data-prefix="12" ><code>  res.send('Hello World'))
                    res.return() // unhook the router so next route can be used
                </code></pre></div>
            
                
            </div>
            
      )
}