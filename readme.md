 
<h1 align="center">Visi.js</h1>


#  why use visi?:

Visi.js is not a framework -> it is an extensive library built to simplify SPA development and make it more abstract allowing MPA functionality.

Features:
 
* Asynchronous component compiling system. 
* Parrallel data handling using lazy-javascript and querysharding, 
* Express.js like routing system!
* FS using localstorage & Os
* cfr (client side fly rendering) - compiles once and renders on the fly!
 

# New
* cfr is avalible heres how to get started it allows you to compile once and render on the fly! just set `data-render="cfr"` on your html tag and visi will do the rest! - cfr clears cache every 2 minutes!
```js
```html
<html lang="en" data-env="production" data-render="cfr">
```
you can manage the cfr cache time and version in your index.js file
```js
window.CACHE_EXPIRATION_TIME = 120;
window.updateCacheVersion(2) // new version
```

# soon
* sse rendering maybe 
* file based routing any jsx tsx or html page in the pages folder will be rendered as a route

[Website](https://postr-inc.github.io/visi.js/#/) | [Docs](https://postr-inc.gitbook.io/visi.js-docs/)
| [Discord](https://discord.gg/RGYQKENTRk)
  
 
##  Maintainers

- [Malik](https://github.com/MalikWhitten67)

##  Contributing

See [the contributing file](contributing.md)!

 
PRs accepted.

 
