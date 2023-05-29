 
<h1 align="center">Visi.js</h1>


#  why use visi?:

Visi.js is not a framework -> it is an extensive library built to simplify SPA development and make it more abstract allowing MPA functionality.

Features:
 
* Asynchronous component compiling system. 
* Parrallel data handling using lazy-javascript and querysharding, 
* Express.js like hash router & history router
* FS using localstorage & Os & sqlstore 
* cfr (client side fly rendering) - compiles once and renders on the fly!

# new 1.7.6-stable
* added  notifier class for web notifications & push notifications aswell as a ReactRouter_v2 which uses history routing
 
```js
 let eventType = "newMessage";
notifier.subscribe(eventType, (notification) => {
  console.log("New notification:", notification);
});
notifier.handleNotificationClick = (event) => {
  console.log("Notification clicked:", event.notification);
};
notifier.handleNotificationClose = (event) => {
  console.log("Notification closed:", event.notification);
};

// Triggering a notification
notifier.send("New message received!", { body: "Click to view.", icon: "notification.png" });

// react router v2
const app = new  ReactRouter_v2();
app.init('#app');
app.use('/', (req, res) => {
      res.send('Hello World!');
      // Handle the home route
      console.log('Home route matched!');
 });
    
     
app.use('/about', (req, res) => {
      res.send('About page');
      // Handle the about route
      console.log('About route matched!');
});
    

app.navigateTo('/');
app.navigateTo('/about');

app.on('routeChange', (route, params) => {
      console.log('Route changed:', route);
      console.log('Params:', params);
});
 
```
# soon
* sse rendering -> one & off compiling user sends sse connection server renders and sends back to client
 

[Website](https://postr-inc.github.io/visi.js/#/) | [Docs](https://postr-inc.gitbook.io/visi.js-docs/)
| [Discord](https://discord.gg/RGYQKENTRk)
  
 
##  Maintainers

- [Malik](https://github.com/MalikWhitten67)

##  Contributing

See [the contributing file](contributing.md)!

 
PRs accepted.

 
