# Visi.js 


based on: [react](https://github.com/facebook/react)
<img src="https://th.bing.com/th/id/OIP.0svpkBNR3r695Jtm5nWycgAAAA?pid=ImgDet&rs=1" width="30">
<br>
<br>
<br>
why visi?:
If you like just standard static websites this is useful for adding extensive component support with built in hash routing system, also keeps code clean by using jsx files with babel.
<br>
<br>

# updates

* -> fixed rendering using createroot instead of render 4/29/23
* -> added savestate and restorestate to res object 4/29/23
* -> added lazy-javascript as a dependency for data handling 4/30/23
# Installing

Be sure to import react unpkg cdn files -> these should be placed in the head!
```html
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```
Import visi modules and import all your jsx files
```html
<script src="https://unpkg.com/visi.js@1.2.0/React.js" type="module">
    
// this imports all the visi files
"React.js" -> all imports from react that allows the components to be globally used
"router.js" -> hash router good for spa sites
"errors.js" -> built in error system similar to react nodejs
"components.js" -> imports require -> soon will actually add require functionality like nodejs
"Lazy-javascript" -> package made by me that allows you to handle data in a more efficient way -> using parallel caching and parralel sharding with a chain based array system. https://www.npmjs.com/package/lazy-javascript 
 - Dependecies -> main lazy.js class jsonhandler for parrallel sequential data handling -> CacheManager for saving cache to indexdb
 
</script> 
 <body>
    Import your jsx files here make sure your main js file in this case app.js is text/babel or react   will just error when you try to render jsx in routes!
    <div id="root"></div>
    <script type="module" src="./React.js" ></script>
    <script  src="app.js" type="text/babel"></script>
    <script src="./test.jsx" type="text/babel"></script>
    <script src="./cop.jsx" type="text/babel"></script>
</body>
```
# things to implement
  -> jsx component system which is in vs 1.0.0 except react hooks where not working I will find a fix to that 


  -> Better state management !

 -> ts support
# Examples

Routing

```js
 // no need to import its alr binded to window!
  const router = new ReactRouter() // window module
  // defualt module
  import { ReactRouter } from "https://unpkg.com/visi.js@1.2.0/router.js"
  // define routes 
   
  

  router.bindRoot("element") -> set the root render element 

  // you can require jsx files to be appended to dom, or just use script tags bc it does the same thing just looks cooler :}
  
  require('./components/index.jsx');
   
    /*
     Router on & get both have req and res params: req returns parameters like :id and res returns the response you can have as many parameters as ur application needs 

     res has many functions you can render jsx plaintext or json -> keep in mind you can only render once per event to render again you must use res.return() to close out of the current event and allow a new to be added to listen for the route this keeps the code clean and avoid issues in dom.
    */
  router.on("/app/:id", (req, res) => {
     
     // get the req param
     let val = req.params.id
      
     res.jsx(<El/>)
     res.return() // close out of the current event and allow a new event to be added to listen for the route
   });
   router.on || router.get("", (req, res) => {
     res.sendstatus("404 not found", 404) // you can also send html jsx isnt supported by sendStatus yet! // res.sendStatus("<h1>404 not found</h1>", 404)
     res.return()
   });



 
// onload event allows you to await when the router is ready to be used
router.onload(() => {
    console.log("loaded")
});


 
  ```
  # Api
 
## Listening for route changes
  * router.on(path, callback) -> listen for a route and allow all requests
    * /route/:param -> req.params.param allows you to get the param from the route just like express!
    * callback -> req, res
    * req.params.param -> get the param from the route
    * res.jsx(element) -> render jsx element to the dom
    * res.send("text") -> send text or html to the client
    * res.redirect("/route") -> redirect to a route
    * res.sendstatus(message, code) -> send a status code with a message
    * res.sendFile("./index.html") -> send a file to the client
    * res.saveState() -> save the current state of the route
    * res.restoreState() -> restore the state of the route

## Setting root route
  * router.root(path, callback) -> set the starting route on page load
    * /route/:param -> req.params.param allows you to get the param from the route just like express!
    * callback -> req, res
    * req.params.param -> get the param from the route
    * res.jsx(element) -> render jsx element to the dom
    * res.send("text") -> send text or html to the client
    * res.redirect("/route") -> redirect to a route
    * res.sendstatus(message, code) -> send a status code with a message
    * res.sendFile("./index.html") -> send a file to the client
    * res.saveState() -> save the current state of the route
    * res.restoreState() -> restore the state of the route

## Listening for get requests 
   
  * router.get("/url/:optionalparam", callback) -> listen for a get request and allow all requests
    * /route/:param -> req.params.param allows you to get the param from the route just like express!
    * callback -> req, res
    * req.params.param -> get the param from the route
    * res.jsx(element) -> render jsx element to the dom
    * res.send("text") -> send text or html to the client
    * res.redirect("/route") -> redirect to a route
    * res.sendstatus(message, code) -> send a status code with a message
    * res.sendFile("./index.html") -> send a file to the client
    * res.saveState() -> save the current state of the route
    * res.restoreState() -> restore the state of the route



# Lazy Javascript

In lazy js we can use chain array methods to query through arrays but also use the jsonHandler to handle data in a more efficient way -> using parallel caching and parralel sharding with a chain based array system. https://www.npmjs.com/package/lazy-javascript 
 - Dependecies -> main lazy.js class jsonhandler for parrallel sequential data handling -> CacheManager for saving cache to indexdb
 
```js

async function data(){
  return  [
    {
      "id": "644e590c25e4ba0464e6abb2",
      "email": "larsen_harrell@strezzo.vc",
      "roles": [
        "admin"
      ],
      "apiKey": "9efca4a8-4e88-4d6e-9fb2-b7eb95873031",
      "profile": {
        "dob": "1992-09-15",
        "name": "Larsen Harrell",
        "about": "Incididunt ad enim laborum laborum esse dolor deserunt. Eiusmod reprehenderit aute irure tempor laboris velit duis.",
        "address": "44 Ebony Court, Brambleton, Kentucky",
        "company": "Strezzo",
        "location": {
          "lat": -50.296774,
          "long": 33.134973
        }
      },
      "username": "larsen92",
      "createdAt": "2012-07-26T00:24:26.437Z",
      "updatedAt": "2012-07-27T00:24:26.437Z"
    },
    {
      "id": "644e590c07cb5d3fc7e76edd",
      "email": "dawson_key@andryx.ki",
      "roles": [
        "member",
        "admin"
      ],
      "apiKey": "dd9f5938-2d63-4fb0-8b92-8b23451be416",
      "profile": {
        "dob": "1989-11-27",
        "name": "Dawson Key",
        "about": "Amet culpa mollit est sunt tempor. Consequat esse cillum fugiat consequat consequat fugiat proident consectetur culpa id occaecat excepteur ea incididunt.",
        "address": "2 Hudson Avenue, Bowden, Florida",
        "company": "Andryx",
        "location": {
          "lat": -23.943235,
          "long": 39.689687
        }
      },
      "username": "dawson89",
      "createdAt": "2013-07-20T15:00:07.544Z",
      "updatedAt": "2013-07-21T15:00:07.544Z"
    },
    {
      "id": "644e590ca2838873c8fb04f6",
      "email": "schmidt_robbins@deepends.moe",
      "roles": [
        "owner",
        "guest"
      ],
      "apiKey": "b9b6ac4e-2491-41f0-8bf4-3e1c6eaddada",
      "profile": {
        "dob": "1988-06-14",
        "name": "Schmidt Robbins",
        "about": "Ex non aliquip ad dolor mollit irure reprehenderit Lorem ad pariatur nulla nulla adipisicing. Lorem anim non dolor esse eu excepteur.",
        "address": "18 Bush Street, Weeksville, Oklahoma",
        "company": "Deepends",
        "location": {
          "lat": 7.030377,
          "long": -167.028692
        }
      },
      "username": "schmidt88",
      "createdAt": "2014-01-28T10:41:48.358Z",
      "updatedAt": "2014-01-29T10:41:48.358Z"
    },
    {
      "id": "644e590c0df69385d4009bae",
      "email": "katelyn_caldwell@frosnex.praxi",
      "roles": [
        "guest",
        "admin"
      ],
      "apiKey": "276c875a-eb71-4031-997b-1482290e2016",
      "profile": {
        "dob": "1990-06-09",
        "name": "Katelyn Caldwell",
        "about": "Ex veniam proident duis Lorem officia dolor ea cillum ut nulla. Minim aliquip qui ea mollit pariatur pariatur culpa proident.",
        "address": "57 Newport Street, Bowmansville, North Carolina",
        "company": "Frosnex",
        "location": {
          "lat": -83.456369,
          "long": -64.110531
        }
      },
      "username": "katelyn90",
      "createdAt": "2011-05-24T12:33:40.496Z",
      "updatedAt": "2011-05-25T12:33:40.496Z"
    },
    {
      "id": "644e590ca52324368cc64b31",
      "email": "dale_cantrell@datagen.doha",
      "roles": [
        "owner",
        "admin"
      ],
      "apiKey": "c84dc286-b182-47f8-bbdd-fb27f2b9714d",
      "profile": {
        "dob": "1990-06-14",
        "name": "Dale Cantrell",
        "about": "Reprehenderit non quis magna minim eiusmod officia consequat pariatur officia non laborum duis consequat. Exercitation adipisicing amet magna dolore ex nisi sit labore sunt ea nostrud voluptate.",
        "address": "11 Cove Lane, Bennett, Alabama",
        "company": "Datagen",
        "location": {
          "lat": 40.347289,
          "long": -162.139329
        }
      },
      "username": "dale90",
      "createdAt": "2014-04-14T06:46:58.158Z",
      "updatedAt": "2014-04-15T06:46:58.158Z"
    }
  ]
}
 
 // this is our data all data has to be a function for jsonhandler to work -> if you are only using the lazy class u can use just an array no need for a function 

 // now lets say we want to duplicate the array on 5 shards we first need to create a lazy & jsonhandeler class instance - these two are alr prebinded to the window!

 const lazy = new Lazy()
 const jsonhandler = new JsonHandler()

 // now we are going to use jsonhandler.querywithSharding to duplicate the data on 5 shards

 jsonhandler.queryWithSharding([data, data, data, data, data], 5).then((res) => {
   console.log(res)
   // output:
   (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   test.js:360 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   test.js:360 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   test.js:360 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   test.js:360 (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   // we duplicated the data -> now we do not have to just use the same data we can have different data on each shard! just change the data in the fn array and you are good to go!
   
   // lets do some sorting 

   first pass lazy the arrays
    const lazy = new Lazy(res[0]) // res[0 - 5] we want data on the first shard!
    lazy.sort((a, b) => { new Date(a.createdAt) - new Date(b.createdAt) }).forEach((data) => {
      // what we just did was sort by date and logged the out put their are various methods you can use on the lazy class to manipulate the data!
        console.log(data)
    })
 
 })

```
## Lazy class Api

* constructor(arr): Initializes a new instance of the Lazy class with an array as its input.

* map(fn): Returns a new Lazy instance with the result of applying the given function fn to each element in the array.

* filter(fn): Returns a new Lazy instance with only the elements in the array that satisfy the given predicate function fn.

* reduce(fn, initialValue): Returns the accumulated result of applying the binary operator function fn to the elements of the array, starting with the given initialValue.

* subscribe(subscriber): Adds a subscriber function to the Lazy instance, which will be called whenever an array operation is performed.

* setStore(key, value): Adds the given value to the Lazy instance's internal store under the given key.

* getStore(key): Returns the value associated with the given key in the Lazy instance's internal store.

* sort(comparator): Returns a new Lazy instance with the elements in the array sorted according to the given comparator function.

* reverse(): Returns a new Lazy instance with the elements in the array reversed.

* find(fn): Returns the first element in the array that satisfies the given predicate function fn.

* some(fn): Returns true if at least one element in the array satisfies the given predicate function fn, otherwise false.

* every(fn): Returns true if all elements in the array satisfy the given predicate function fn, otherwise false.

* concat(...args): Returns a new Lazy instance with the elements of the original array concatenated with the given arrays.

* slice(start, end): Returns a new Lazy instance with a portion of the original array specified by the start and end indices.

* splice(start, deleteCount, ...items): Modifies the original array by removing or replacing elements and/or inserting new elements.

* push(...items): Adds one or more elements to the end of the original array and returns its new length.

* pop(): Removes the last element from the original array and returns it.

* shift(): Removes the first element from the original array and returns it.

* unshift(...items): Adds one or more elements to the beginning of the original array and returns its new length.

* forEach(fn): Executes the given function fn for each element in the original array.

* includes(item): Returns true if the given item is found in the original array, otherwise false.

* indexOf(item): Returns the first index at which the given item can be found in the original array, or -1 if it is not present.

* lastIndexOf(item): Returns the last index at which the given item can be found in the original array, or -1 if it is not present.

* join(separator): Returns a string representing the original array, with the elements separated by the given separator.

* toString(): Returns a string representing the original array.

* notifySubscribers(fnName, args): Notifies all subscribers of the Lazy instance that an array operation has been performed with the given function name fnName and arguments args.

 

## JsonHandler class Api

* query(queryFn: function): Promise<any> - Executes the specified query function and returns its result. If the result is already cached, returns the cached result instead. If an error occurs while executing the query, it is logged to the console and re-thrown.

* subscribe(subscriber: function): void - Adds a subscriber function to the set of subscribers. Subscribers are notified whenever a query result is cached.

* unsubscribe(subscriber: function): void - Removes a subscriber function from the set of subscribers.

* getCacheSizePerNode(): object - Returns an object containing the size of the cache for each node.

* notifySubscribers(fnName: string, args: any[], result: any): void - Notifies all subscribers with the specified function name, arguments, and result.

* queryParallel(queryFns: function[]): Promise<any[]> - Executes multiple query functions in parallel and returns an array of their results.

* queryWithSharding(queryFns: function[], shardCount: number): Promise<any[]> - Executes the specified query functions with sharding and returns an array of their results. The shardCount parameter specifies the number of shards to create.

* saveCache(saveFn: function): void - Saves the cache to a storage location specified by the provided save function.

 

* reloadShards(): Promise<any[]> - Reloads the results for all shards and returns an array of the combined result

## Maintainers

- [Malik](https://github.com/MalikWhitten67)


## Contributing

See [the contributing file](contributing.md)!
PRs accepted.
 
## Repo
 
[link](https://github.com/Postr-Inc/visi.js)
