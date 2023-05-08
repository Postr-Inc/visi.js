#  Visi.js


#  why use visi?:

> Visi.js isnt a framework -> it is an extensive library built to simplify spa development and make it more abstract allowing mpa functionality -> it features a components system to allow you to import jsx components using require() like nodejs. aswell as parrallel data handling using lazy-javascript and querysharding, and furthermore providing express like routing and a built in error system.

  

> Website built w visi.js -> [view repo](https://github.com/Postr-Inc/visi.js/tree/website)

[Website](https://postr-inc.github.io/visi.js/#/) | [Docs](https://postr-inc.gitbook.io/visi.js-docs/)
| [Discord](https://discord.gg/RGYQKENTRk)
  

> **Updates**: New updates are coming soon! recently added -> :

  

* -> fixed rendering using createroot instead of render 4/29/23

  

* -> added savestate and restorestate to res object 4/29/23

  

* -> added lazy-javascript as a dependency for data handling 4/30/23

  

* -> made error system more efficient and cleaner 4/30/23

  

* -> added setCookie/GetCookie to res object 5/1/23

  

* -> added query params to req object 5/1/23 now you can /route/?param and use req.query.param to get the value aswell as subsets like /route?param=1&param2=2

  

* -> ip tracking 5/1/23 & json file importing in require!

  

* -> added tailwind css support 5/1/23 & css importing in require!8

  

* -> added bundle size function 5/1/23

  

* -> added `tsx` & `ts` support to require() 5/2/23

* -> added all react hooks now they should work within ts js tsx and jsx scopes 5/2/23
  
* -> component caches visi now caches components to prevent re-fetching 5/3/23 only fetches once per component!

* -> added prefetching of components 5/5/23 - allows you to prefetch components before rendering them to the dom

* -  improved speed of prefetching 5/7/23
* - added minification of code 5/7/23
* - added a minified version of visi.js use || https://unpkg.com/visi.js/visi.min.js -> for production 5/7/23  regular version size: 80kb visi.min.js size: 40kb
example:
 './prefetch.json' -> prefetches all components in prefetch.json use only for codebases with many components to prevent slow rendering
```json     

{
    "prefetch":[
        files
    ]
    
}
```
```js

prefetch('./prefetch.json') //

```

> **Fixes** :

  

* -> Fixed render accidentally set return after render which caused jsx components not to show on dom 5/1/23

  

* - added back React._render to fix rendering issue @v1.2.7

  

* - fixed require() issue in v1.0.0 @1.2.8 components now are imported properly!

`5/3/23`
* - slow rendering - visi now waits for all components to be imported before rendering @1.3.5 
  
* - fixed bundlesize not returning the apps size @1.3.8

* - fixed prefetching css files @1.3.9


#  Getting Started

Before you get started be sure to import react & your prefered version or lts version of visi.js
heres an example
```html
<head>
<!--development version-->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://unpkg.com/visi.js@your_prefered_version/React.js" type="module"></script>
<!--production version-->
<html lang="en" data-env="production">
<!-- production enahances speed of webpage--->
<script src="https://unpkg.com/visi.js@your_prefered_version/React.js" type="module"></script>
<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone"></script> 
</head>
<body>
    <!--Example body structure of index.html-->
 <div id="root"></div>
 <script src="app.js" type="text/babel"></script>
</body>
```

#  Things to implement
-> minification of code -> visi doesnt minify jsx soon we will try to implement this feature
-> multi-thread component compiling @v1.3.9 release soon!

> Examples

```jsx
// template.jsx
function Template(props) {

    return (

        <
        div >

        <
        h1 > {
            props.text
        } < /h1>

        <
        /div> 

    )


}

// main jsx file


let Template = require('./Template.jsx');

function App() {

    return (

        <
        div >

        <
        Template text = "jelly bun cinnamon popsicle" / >

        <
        /div>

    )

}


let App = require('./App.jsx');

router.on("/test", (req, res) => {

    res.render( < App / > )

    res.return()

})

```

##  Maintainers

- [Malik](https://github.com/MalikWhitten67)

##  Contributing

See [the contributing file](contributing.md)!

  

PRs accepted.

  

##  Github Repo

  

[link](https://github.com/Postr-Inc/visi.js)