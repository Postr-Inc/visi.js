#  Visi.js

  

#  why use visi?:

  

  

> Visi.js isnt a framework -> it is an extensive library built to simplify spa development and make it more abstract allowing mpa functionality -> it features a components system to allow you to import jsx components using require() like nodejs. aswell as parrallel data handling using lazy-javascript and querysharding, and furthermore providing express like routing and a built in error system.

  

> Beta: May or may not work atm!

  

[Website](https://visijs.rf.gd#/about) | [Docs](https://postr-inc.gitbook.io/visi.js-docs/)

  

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
  
  

> **Fixes** :

  

* -> Fixed render accidentally set return after render which caused jsx components not to show on dom 5/1/23

  

* - added back React._render to fix rendering issue @v1.2.7

  

* - fixed require() issue in v1.0.0 @1.2.8 components now are imported properly!

  

  

#  Getting Started

  
Before you get started be sure to import react unpkg cdn files -> these should be placed in the head of your main html file

  

```html

<script src="https://unpkg.com/react@18/umd/react.development.js"></script>

  

<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

  

<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  

```

Import the latest visi.js file -> this should be placed in the body of your main html file above your main js file 

```html

<script src="https://unpkg.com/visi.js@1.3.4/React.js" type="module"></script>

  

<body>

<div id="root"></div>

<script type="module" src="./React.js"  ></script>

<script src="app.js" type="text/babel"></script>

</body>

  

```


#  Things to implement

  

-> Add more component library support!

  

-> Add lazy loading of files

  

-> less css support


#  ErrorTrace

```js
// to toggle on add to top of your file
ErrorTrace()  

```

> Examples

#  Tailwind & css support

```jsx

require('./styles.css');
require('@tailwindcss/preset-you-want-to-use'); 

```  

#  Bundlesize


```js

// you can read your app's bundle size using the bundleSize() function

bundleSize() // this will return the size of your app in bytes / kb/ mb or gb

```

##  jsx importing with require


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

#  Parralel querying cache and sharding

  
Visi.js allows Parallel Querys and parallel caching via https://www.npmjs.com/package/lazy-javascript

  

- Dependecies -> main lazy.js class jsonhandler for parrallel sequential data handling -> CacheManager for saving cache to indexdb



```js
async function data() {


    return [
        // some json data here 
    ]
}

const jsonhandler = new JsonHandler()

jsonhandler.queryWithSharding([data, data, data, data, data], 5).then((res) => {



    console.log(res)


    // output:

    (15)[{
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}, {
        …}] x 4


    // we duplicated the data -> now we do not have to just use the same data we can have different data on each shard! just change the data in the fn array and you are good to go!

    // lets do some sorting first  pass  lazy  the  arrays

    const lazy = new Lazy(res[0]) // res[0 - 5] we want data on the first shard!

    lazy.sort((a, b) => {
        new Date(a.createdAt) - new Date(b.createdAt)
    }).forEach((data) => {

        // what we just did was sort by date and logged the out put their are various methods you can use on the lazy class to manipulate the data!

        console.log(data)
    })
})


```

##  Maintainers

- [Malik](https://github.com/MalikWhitten67)

##  Contributing

See [the contributing file](contributing.md)!

  

PRs accepted.

  

##  Github Repo

  

[link](https://github.com/Postr-Inc/visi.js)