class ReactRouter {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.store = {};
    this.rootElement = null;
    this.hashChangeListener = null;
    let storedroutes = []
  }

  route(path) {
    this.routes[path] = true;
  }
  root(path, callback) {
    const paramNames = [];
    window.location.hash = path;
    const parsedPath = path.split('/').map(part => {
      if (part.startsWith(':')) {
        paramNames.push(part.substring(1));
        return '([^/]+)';
      }
      return part;
    }).join('/');
    const regex = new RegExp('^' + parsedPath + '$');

    this.routes[path] = true;
     
    this.currentUrl = path;

    if (window.location.hash.substring(1).match(regex)) {
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};
      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }

      const req = {
        params: params,
        rootUrl: this.currentUrl,
        url:window.location.hash.substring(1),
      };


      let hooked = false;
      const res = {
        json: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          try {
            const jsonData = JSON.stringify(data);
            const html = `<pre>${jsonData}</pre>`;
            document.getElementById(this.rootElement).innerHTML = html;
            hooked = true;
          } catch (e) {
            throw new Error("Invalid JSON data");
          }
        },
        title: (title) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          document.title = title;
          hooked = true;
        },
        saveState: () => {
          if (hooked) {
            throw new Error("State has already been saved cannot save again");
          }
          const route = window.location.hash.substring(1);
          // save the current route in history
          if(window.sessionStorage.getItem(route)){
             window.location.hash = window.sessionStorage.getItem(route);
          } else{
            window.sessionStorage.setItem(route, route);
          }
          hooked = true;
           
        },
        restoreState: () => {
          if (hooked) {
            throw new Error("State has already been restored cannot restore again");
          }
          // restore the current route in history
          let route = window.location.hash.substring(1);
            if(window.sessionStorage.getItem(route)){
              window.location.hash = window.sessionStorage.getItem(route);
            } else{
              window.location.hash = this.currentUrl;
            }
          hooked = true;
        },
        send: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          document.getElementById(this.rootElement).innerHTML = data;
          hooked = true;
        },
        jsx: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          window.React._render(data)(this.rootElement);
          hooked = true;
        },
        return: () => {
          if (hooked) {
            hooked = false;
          }
          if (this.hashChangeListener) {
            window.removeEventListener("hashchange", this.hashChangeListener);
            this.hashChangeListener = null;
            console.log("removed last event listener")
          }
        },
        sendStatus: (msg, code) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          
            if(typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code 
              hooked = true;
            }else{
              throw new Error("Invalid status code");
            }
               
       
          
        },
        redirect: (url) => {
          
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          window.location.hash = url;
          hooked = true;
        
        },
        sendFile: (file) => {
          let element = this.rootElement
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          
          let xhr = new XMLHttpRequest();
          xhr.open('GET', file);
          xhr.responseType = 'blob';
          xhr.onload = function() {
             if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")){
              document.getElementById(element).innerHTML =  `<img src="${file}" />`;
            }else if(file.endsWith(".json")){
              console.log("json")
              fetch(file)
              .then(response => response.json())
              .then(data => {
                const jsonData = JSON.stringify(data);
                const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                document.getElementById(element).innerHTML = html;
              })
            }
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = file;
            a.click();
          };
          xhr.send();
        }

      }
      if (!this.hashChangeListener) {
        this.hashChangeListener = () => {
          if (window.location.hash.substring(1).match(regex)) {
            const matches = window.location.hash.substring(1).match(regex);
            const params = {};
            for (let i = 0; i < paramNames.length; i++) {
              params[paramNames[i]] = matches[i + 1];
            }

            const req = {
              params: params,
              rootUrl: this.currentUrl,
              url:window.location.hash.substring(1),
            };

            const res = {
              json: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                try {
                  const jsonData = JSON.stringify(data);
                  const html = `<pre>${jsonData}</pre>`;
                  document.getElementById(this.rootElement).innerHTML = html;
                  hooked = true;
                } catch (e) {
                  throw new Error("Invalid JSON data");
                }
              },
              title: (title) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                document.title = title;
                hooked = true;
              },
              saveState: () => {
                if (hooked) {
                  throw new Error("State has already been saved cannot save again");
                }
                const route = window.location.hash.substring(1);
                // save the current route in history
                if(window.sessionStorage.getItem(route)){
                   window.location.hash = window.sessionStorage.getItem(route);
                } else{
                  window.sessionStorage.setItem(route, route);
                }
                hooked = true;
                 
              },
              restoreState: () => {
                if (hooked) {
                  throw new Error("State has already been restored cannot restore again");
                }
                // restore the current route in history
                let route = window.location.hash.substring(1);
                  if(window.sessionStorage.getItem(route)){
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else{
                    window.location.hash = this.currentUrl;
                  }
                hooked = true;
              },
              send: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                document.getElementById(this.rootElement).innerHTML = data;
                hooked = true;
              },
              jsx: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                window.React._render(data)(this.rootElement);
                hooked = true;
              },
              return: () => {
                if (hooked) {
                  hooked = false;
                }
                if (this.hashChangeListener) {
                  window.removeEventListener("hashchange", this.hashChangeListener);
                  this.hashChangeListener = null;
                  console.log("removed last event listener")
                }
              },
              sendStatus: (msg, code) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                
                  if(typeof code === 'number') {
                    document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code 
                    hooked = true;
                  }else{
                    throw new Error("Invalid status code");
                  }
                     
             
                
              },
              redirect: (url) => {
                
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                window.location.hash = url;
                hooked = true;
              
              },
              sendFile: (file) => {
                let element = this.rootElement
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                
                let xhr = new XMLHttpRequest();
                xhr.open('GET', file);
                xhr.responseType = 'blob';
                xhr.onload = function() {
                   if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")){
                    document.getElementById(element).innerHTML =  `<img src="${file}" />`;
                  }else if(file.endsWith(".json")){
                    console.log("json")
                    fetch(file)
                    .then(response => response.json())
                    .then(data => {
                      const jsonData = JSON.stringify(data);
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                  }
                  let a = document.createElement('a');
                  a.href = window.URL.createObjectURL(xhr.response);
                  a.download = file;
                  a.click();
                };
                xhr.send();
              }
      
            }

            callback(req, res);
          }
        };

        window.addEventListener("hashchange", this.hashChangeListener);
      }

      callback(req, res);

      return true;
    }

    return false;
  }

   

  bindRoot(element) {
    this.rootElement = element
  }

  onload(callback) {
    window.onload = () => {
      // domcontentloaded
      window.addEventListener("DOMContentLoaded", callback())
    }
  }
  get(path, callback) {
    const paramNames = [];
    const parsedPath = path.split('/').map(part => {
      if (part.startsWith(':')) {
        paramNames.push(part.substring(1));
        return '([^/]+)';
      }
      return part;
    }).join('/');
    const regex = new RegExp('^' + parsedPath + '$');

    this.routes[path] = true;
     
    this.currentUrl = path;

    if (window.location.hash.substring(1).match(regex)) {
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};
      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }

      const req = {
        params: params,
        rootUrl: this.currentUrl,
        url:window.location.hash.substring(1),
      };


      let hooked = false;
      const res = {
        json: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          try {
            const jsonData = JSON.stringify(data);
            const html = `<pre>${jsonData}</pre>`;
            document.getElementById(this.rootElement).innerHTML = html;
            hooked = true;
          } catch (e) {
            throw new Error("Invalid JSON data");
          }
        },
        title: (title) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          document.title = title;
          hooked = true;
        },
        saveState: () => {
          if (hooked) {
            throw new Error("State has already been saved cannot save again");
          }
          const route = window.location.hash.substring(1);
          // save the current route in history
          if(window.sessionStorage.getItem(route)){
             window.location.hash = window.sessionStorage.getItem(route);
          } else{
            window.sessionStorage.setItem(route, route);
          }
          hooked = true;
           
        },
        restoreState: () => {
          if (hooked) {
            throw new Error("State has already been restored cannot restore again");
          }
          // restore the current route in history
          let route = window.location.hash.substring(1);
            if(window.sessionStorage.getItem(route)){
              window.location.hash = window.sessionStorage.getItem(route);
            } else{
              window.location.hash = this.currentUrl;
            }
          hooked = true;
        },
        send: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          document.getElementById(this.rootElement).innerHTML = data;
          hooked = true;
        },
        jsx: (data) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          window.React._render(data)(this.rootElement);
          hooked = true;
        },
        return: () => {
          if (hooked) {
            hooked = false;
          }
          if (this.hashChangeListener) {
            window.removeEventListener("hashchange", this.hashChangeListener);
            this.hashChangeListener = null;
            console.log("removed last event listener")
          }
        },
        sendStatus: (msg, code) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          
            if(typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code 
              hooked = true;
            }else{
              throw new Error("Invalid status code");
            }
               
       
          
        },
        redirect: (url) => {
          
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          window.location.hash = url;
          hooked = true;
        
        },
        sendFile: (file) => {
          let element = this.rootElement
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          
          let xhr = new XMLHttpRequest();
          xhr.open('GET', file);
          xhr.responseType = 'blob';
          xhr.onload = function() {
             if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")){
              document.getElementById(element).innerHTML =  `<img src="${file}" />`;
            }else if(file.endsWith(".json")){
              console.log("json")
              fetch(file)
              .then(response => response.json())
              .then(data => {
                const jsonData = JSON.stringify(data);
                const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                document.getElementById(element).innerHTML = html;
              })
            }
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = file;
            a.click();
          };
          xhr.send();
        }

      }
      if (!this.hashChangeListener) {
        this.hashChangeListener = () => {
          if (window.location.hash.substring(1).match(regex)) {
            const matches = window.location.hash.substring(1).match(regex);
            const params = {};
            for (let i = 0; i < paramNames.length; i++) {
              params[paramNames[i]] = matches[i + 1];
            }

            const req = {
              params: params,
              rootUrl: this.currentUrl,
              url:window.location.hash.substring(1),
            };

            const res = {
              json: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                try {
                  const jsonData = JSON.stringify(data);
                  const html = `<pre>${jsonData}</pre>`;
                  document.getElementById(this.rootElement).innerHTML = html;
                  hooked = true;
                } catch (e) {
                  throw new Error("Invalid JSON data");
                }
              },
              title: (title) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                document.title = title;
                hooked = true;
              },
              saveState: () => {
                if (hooked) {
                  throw new Error("State has already been saved cannot save again");
                }
                const route = window.location.hash.substring(1);
                // save the current route in history
                if(window.sessionStorage.getItem(route)){
                   window.location.hash = window.sessionStorage.getItem(route);
                } else{
                  window.sessionStorage.setItem(route, route);
                }
                hooked = true;
                 
              },
              restoreState: () => {
                if (hooked) {
                  throw new Error("State has already been restored cannot restore again");
                }
                // restore the current route in history
                let route = window.location.hash.substring(1);
                  if(window.sessionStorage.getItem(route)){
                    window.location.hash = window.sessionStorage.getItem(route);
                  } else{
                    window.location.hash = this.currentUrl;
                  }
                hooked = true;
              },
              send: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                document.getElementById(this.rootElement).innerHTML = data;
                hooked = true;
              },
              jsx: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                window.React._render(data)(this.rootElement);
                hooked = true;
              },
              return: () => {
                if (hooked) {
                  hooked = false;
                }
                if (this.hashChangeListener) {
                  window.removeEventListener("hashchange", this.hashChangeListener);
                  this.hashChangeListener = null;
                  console.log("removed last event listener")
                }
              },
              sendStatus: (msg, code) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                
                  if(typeof code === 'number') {
                    document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code 
                    hooked = true;
                  }else{
                    throw new Error("Invalid status code");
                  }
                     
             
                
              },
              redirect: (url) => {
                
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                window.location.hash = url;
                hooked = true;
              
              },
              sendFile: (file) => {
                let element = this.rootElement
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                
                let xhr = new XMLHttpRequest();
                xhr.open('GET', file);
                xhr.responseType = 'blob';
                xhr.onload = function() {
                   if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")){
                    document.getElementById(element).innerHTML =  `<img src="${file}" />`;
                  }else if(file.endsWith(".json")){
                    console.log("json")
                    fetch(file)
                    .then(response => response.json())
                    .then(data => {
                      const jsonData = JSON.stringify(data);
                      const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                      document.getElementById(element).innerHTML = html;
                    })
                  }
                  let a = document.createElement('a');
                  a.href = window.URL.createObjectURL(xhr.response);
                  a.download = file;
                  a.click();
                };
                xhr.send();
              }
      
            }

            callback(req, res);
          }
        };

        window.addEventListener("hashchange", this.hashChangeListener);
      }

      callback(req, res);

      return true;
    }

    return false;
  }
  
  on(path, callback) {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      const route = path.split('/')[1];
      const params = {};
      const paramNames = path.match(/:[^/]+/g) || [];
  
      // Extract query parameters from the URL
      
  
      // Construct the regex pattern to match the route and extract the parameter value
      const pattern = path.replace(/:[^/]+/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = hash.match(regex);
  
      // Check if the route matches the current hash
      if (match && route === hash.split('/')[1]) {
        // Populate the params object with the parameter values
        paramNames.forEach((paramName, index) => {
          params[paramName.substring(1)] = match[index + 1];
        });
  
        const req = {
          rootUrl: window.location.origin,
          url: window.location.hash,
          params: params
        };
  
        let hooked = false;
        const res = {
          json: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            try {
              const jsonData = JSON.stringify(data);
              const html = `<pre>${jsonData}</pre>`;
              document.getElementById(this.rootElement).innerHTML = html;
              hooked = true;
            } catch (e) {
              throw new Error("Invalid JSON data");
            }
          },
          title: (title) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.title = title;
            hooked = true;
          },
          saveState: () => {
            if (hooked) {
              throw new Error("State has already been saved cannot save again");
            }
            const route = window.location.hash.substring(1);
            // save the current route in history
            if(window.sessionStorage.getItem(route)){
               window.location.hash = window.sessionStorage.getItem(route);
            } else{
              window.sessionStorage.setItem(route, route);
            }
            hooked = true;
             
          },
          restoreState: () => {
            if (hooked) {
              throw new Error("State has already been restored cannot restore again");
            }
            // restore the current route in history
            let route = window.location.hash.substring(1);
              if(window.sessionStorage.getItem(route)){
                window.location.hash = window.sessionStorage.getItem(route);
              } else{
                window.location.hash = this.currentUrl;
              }
            hooked = true;
          },
          send: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            document.getElementById(this.rootElement).innerHTML = data;
            hooked = true;
          },
          jsx: (data) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            window.React._render(data)(this.rootElement);
            hooked = true;
          },
          return: () => {
            if (hooked) {
              hooked = false;
            }
            if (this.hashChangeListener) {
              window.removeEventListener("hashchange", this.hashChangeListener);
              this.hashChangeListener = null;
              console.log("removed last event listener")
            }
          },
          sendStatus: (msg, code) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            
              if(typeof code === 'number') {
                document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code 
                hooked = true;
              }else{
                throw new Error("Invalid status code");
              }
                 
         
            
          },
          redirect: (url) => {
            
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            window.location.hash = url;
            hooked = true;
          
          },
          sendFile: (file) => {
            let element = this.rootElement
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            
            let xhr = new XMLHttpRequest();
            xhr.open('GET', file);
            xhr.responseType = 'blob';
            xhr.onload = function() {
               if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")){
                document.getElementById(element).innerHTML =  `<img src="${file}" />`;
              }else if(file.endsWith(".json")){
                console.log("json")
                fetch(file)
                .then(response => response.json())
                .then(data => {
                  const jsonData = JSON.stringify(data);
                  const html = `<textarea style="width:100%;height:100%; resize:none; border:none;">${jsonData}</textarea>`
                  document.getElementById(element).innerHTML = html;
                })
              }
              let a = document.createElement('a');
              a.href = window.URL.createObjectURL(xhr.response);
              a.download = file;
              a.click();
            };
            xhr.send();
          }
  
        }
  
        callback(req, res);
      }
    });
  }
  
  // Remove the current hash change event listener
   

  error(callback) {
    window.onhashchange = (e) => {
      const path = e.newURL.split("#")[1];
      if (!this.routes[path]) {
        callback();
      }
    }
  }
}


window.ReactRouter =  ReactRouter;
export default window.ReactRouter;