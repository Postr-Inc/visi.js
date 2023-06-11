 
<h1 align="center">Visi.js</h1>


#  why use visi?:

Visi.js is not a framework -> it is an extensive library built to simplify SPA development and make it more abstract allowing MPA functionality.

Features:
 
* Asynchronous component compiling system. 
* Parrallel data handling using lazy-javascript and querysharding, 
* Express.js like hash router & history router
* FS using localstorage & Os & sqlstore 
* cfr (component first rendering) -  a new way to render components
* full typescript support!

#  1.8.3-stable
* visijs now handles react versions & caches them using cfr 
 - it relies on data-env to know which type to use whether production or development so set it to production when deploying!
 - this has been implemented to help fix the chain request issue that lighthouse has and also helps with performance
 - dont worry about visitors having invalid react versions it auto updates based on the latest version of react!
 - lib also allows you to remove cfr modules by doing libManager.clearModule('somename') u can list libManager.listModules() to see all modules and clearall   - libManager.clearAll()
```html
 <!DOCTYPE html>
<html lang="en"  data-render="cfr" data-env="production" debug   data-react-version="18.2.0"> 
<!-- no longer need to supply react-dom & react visi handles it for you! -->
<script src="./unminified.js" type="text/babel" data-type="module"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script> 
</head>
<body>
    <!--Example body structure of index.html-->
 <div id="app"></div>
 <script src="./test.js" type="text/babel" data-type="module"></script>
  
</body>
 
</html>
```
# soon
* better tsx support! v1.8+
 

[Website](https://visijs.postr-inc.me/) | [Docs](https://visijs.postr-inc.me/#/docs/en-US/v1.8.8/intro)
| [Discord](https://discord.gg/RGYQKENTRk)
  
 
##  Maintainers

- [Malik](https://github.com/MalikWhitten67)

##  Contributing

See [the contributing file](contributing.md)!

 
PRs accepted.

 
