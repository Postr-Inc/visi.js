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
    const queryNames = [];
    window.location.hash = path;
    const parsedPath = path.split('/').map(part => {
      if (part.startsWith(':')) {
        paramNames.push(part.substring(1));
        return '([^/]+)';
      }
      if (part.startsWith('*')) {
        paramNames.push(part.substring(1));
        return '(.*)';
      }
      if (part.startsWith('?')) {
        queryNames.push(part.substring(1));
        return '([^/]+)';
      }
      return part;
    }).join('/');
    const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');

    this.routes[path] = true;

    this.currentUrl = path;

    if (window.location.hash.substring(1).match(regex)) {
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};

      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }
      if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
        console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
        return false;
      }
      const query = {};

      const queryString = window.location.hash.substring(1).split('?')[1];
      if (queryString) {
        const queryParts = queryString.split('&');
        for (let i = 0; i < queryParts.length; i++) {
          const queryParam = queryParts[i].split('=');
          query[queryParam[0]] = queryParam[1];
        }
      }
      const req = {
        "params": params,
        "query": query,
        "url": window.location.hash.substring(1),
        "method": "ROOT_GET",
      }




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
        setCookie: (name, value, options) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          let cookieString = `${name}=${value};`;
          if (options) {
            if (options.path) {
              cookieString += `path=${options.path};`;
            }
            if (options.domain) {
              cookieString += `domain=${options.domain};`;
            }
            if (options.maxAge) {
              cookieString += `max-age=${options.maxAge};`;
            }
            if (options.httpOnly) {
              cookieString += `httpOnly=${options.httpOnly};`;
            }
            if (options.secure) {
              cookieString += `secure=${options.secure};`;
            }
            if (options.sameSite) {
              cookieString += `sameSite=${options.sameSite};`;
            }
          }
          document.cookie = cookieString;

        },
        getCookie: (name) => {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const cookieName = cookie.split('=')[0];
            if (cookieName === name) {
              const cookieValue = cookie.split('=')[1];
              const cookieOptions = cookie.split(';').slice(1).map(option => {
                const [key, value] = option.split('=').map(str => str.trim());
                return { [key]: value };
              }).reduce((acc, curr) => Object.assign(acc, curr), {});
              return {
                name: cookieName,
                value: cookieValue
              };
            }
          }
          return null;
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
          if (window.sessionStorage.getItem(route)) {
            window.location.hash = window.sessionStorage.getItem(route);
          } else {
            window.sessionStorage.setItem(route, route);
          }
          hooked = true;

        },
        ip: () => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          hooked = true;
          const xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://api.ipify.org?format=json', false);
          xhr.onload = function () {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              return data.ip;
            }
            else {
              console.log('IP Request Failed');
            }
          }
        },
        restoreState: () => {
          if (hooked) {
            throw new Error("State has already been restored cannot restore again");
          }
          // restore the current route in history
          let route = window.location.hash.substring(1);
          if (window.sessionStorage.getItem(route)) {
            window.location.hash = window.sessionStorage.getItem(route);
          } else {
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

          if (typeof code === 'number') {
            document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
            hooked = true;
          } else {
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
          xhr.onload = function () {
            if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
              document.getElementById(element).innerHTML = `<img src="${file}" />`;
            } else if (file.endsWith(".json")) {
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
              url: window.location.hash.substring(1),
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
                if (window.sessionStorage.getItem(route)) {
                  window.location.hash = window.sessionStorage.getItem(route);
                } else {
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
                if (window.sessionStorage.getItem(route)) {
                  window.location.hash = window.sessionStorage.getItem(route);
                } else {
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

                if (typeof code === 'number') {
                  document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
                  hooked = true;
                } else {
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
                xhr.onload = function () {
                  if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                    document.getElementById(element).innerHTML = `<img src="${file}" />`;
                  } else if (file.endsWith(".json")) {
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
    const queryNames = [];
    const parsedPath = path.split('/').map(part => {
      if (part.startsWith(':')) {
        paramNames.push(part.substring(1));
        return '([^/]+)';
      }
      if (part.startsWith('*')) {
        paramNames.push(part.substring(1));
        return '(.*)';
      }
      if (part.startsWith('?')) {
        queryNames.push(part.substring(1));
        return '([^/]+)';
      }
      return part;
    }).join('/');
    const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');

    this.routes[path] = true;

    this.currentUrl = path;

    if (window.location.hash.substring(1).match(regex)) {
      const matches = window.location.hash.substring(1).match(regex);
      const params = {};

      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = matches[i + 1];
      }
      if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
        console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
        return false;
      }
      const query = {};

      const queryString = window.location.hash.substring(1).split('?')[1];
      if (queryString) {
        const queryParts = queryString.split('&');
        for (let i = 0; i < queryParts.length; i++) {
          const queryParam = queryParts[i].split('=');
          query[queryParam[0]] = queryParam[1];
        }
      }

      const req = {
        "params": params,
        "query": query,
        "url": window.location.hash.substring(1),
        "method": "GET",
      }


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

        setCookie: (name, value, options) => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          let cookieString = `${name}=${value};`;
          if (options) {
            if (options.path) {
              cookieString += `path=${options.path};`;
            }
            if (options.domain) {
              cookieString += `domain=${options.domain};`;
            }
            if (options.maxAge) {
              cookieString += `max-age=${options.maxAge};`;
            }
            if (options.httpOnly) {
              cookieString += `httpOnly=${options.httpOnly};`;
            }
            if (options.secure) {
              cookieString += `secure=${options.secure};`;
            }
            if (options.sameSite) {
              cookieString += `sameSite=${options.sameSite};`;
            }
          }
          document.cookie = cookieString;

        },
        getCookie: (name) => {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const cookieName = cookie.split('=')[0];
            if (cookieName === name) {
              const cookieValue = cookie.split('=')[1];
              const cookieOptions = cookie.split(';').slice(1).map(option => {
                const [key, value] = option.split('=').map(str => str.trim());
                return { [key]: value };
              }).reduce((acc, curr) => Object.assign(acc, curr), {});
              return {
                name: cookieName,
                value: cookieValue
              };
            }
          }
          return null;
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
          if (window.sessionStorage.getItem(route)) {
            window.location.hash = window.sessionStorage.getItem(route);
          } else {
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
          if (window.sessionStorage.getItem(route)) {
            window.location.hash = window.sessionStorage.getItem(route);
          } else {
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
        ip: () => {
          if (hooked) {
            throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
          }
          hooked = true;
          const xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://api.ipify.org?format=json', false);
          xhr.onload = function () {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              return data.ip;
            }
            else {
              console.error('IP Request Failed');
            }
          }
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

          if (typeof code === 'number') {
            document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
            hooked = true;
          } else {
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
          xhr.onload = function () {
            if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
              document.getElementById(element).innerHTML = `<img src="${file}" />`;
            } else if (file.endsWith(".json")) {
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
              url: window.location.hash.substring(1),
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
              setCookie: (name, value, options) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                let cookieString = `${name}=${value};`;
                if (options) {
                  if (options.path) {
                    cookieString += `path=${options.path};`;
                  }
                  if (options.domain) {
                    cookieString += `domain=${options.domain};`;
                  }
                  if (options.maxAge) {
                    cookieString += `max-age=${options.maxAge};`;
                  }
                  if (options.httpOnly) {
                    cookieString += `httpOnly=${options.httpOnly};`;
                  }
                  if (options.secure) {
                    cookieString += `secure=${options.secure};`;
                  }
                  if (options.sameSite) {
                    cookieString += `sameSite=${options.sameSite};`;
                  }
                }
                document.cookie = cookieString;

              },
              ip: () => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                hooked = true;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://api.ipify.org?format=json', false);
                xhr.onload = function () {
                  if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    return data.ip;
                  }
                  else {
                    console.log('IP Request Failed');
                  }
                }
              },
              getCookie: (name) => {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                  const cookie = cookies[i].trim();
                  const cookieName = cookie.split('=')[0];
                  if (cookieName === name) {
                    const cookieValue = cookie.split('=')[1];
                    const cookieOptions = cookie.split(';').slice(1).map(option => {
                      const [key, value] = option.split('=').map(str => str.trim());
                      return { [key]: value };
                    }).reduce((acc, curr) => Object.assign(acc, curr), {});
                    return {
                      name: cookieName,
                      value: cookieValue
                    };
                  }
                }
                return null;
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
                if (window.sessionStorage.getItem(route)) {
                  window.location.hash = window.sessionStorage.getItem(route);
                } else {
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
                if (window.sessionStorage.getItem(route)) {
                  window.location.hash = window.sessionStorage.getItem(route);
                } else {
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

                if (typeof code === 'number') {
                  document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
                  hooked = true;
                } else {
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
              compress: (data) => {
                if (hooked) {
                  throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
                }
                 let compressed = new CompressionStream( 'gzip' );
                  let encoder = new TextEncoder();
                  let input = encoder.encode( data );
                  let output = compressed.encode( input );
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
                xhr.onload = function () {
                  if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                    document.getElementById(element).innerHTML = `<img src="${file}" />`;
                  } else if (file.endsWith(".json")) {
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
    console.log("Router is already initialized");
    return false;
  }

  on(path, callback) {
    window.addEventListener('hashchange', () => {
      const paramNames = [];
      const queryNames = [];
      const parsedPath = path.split('/').map(part => {
        if (part.startsWith(':')) {
          paramNames.push(part.substring(1));
          return '([^/]+)';
        }
        if (part.startsWith('*')) {
          paramNames.push(part.substring(1));
          return '(.*)';
        }
        if (part.startsWith('?')) {
          queryNames.push(part.substring(1));
          return '([^/]+)';
        }
        return part;
      }).join('/');
      const regex = new RegExp('^' + parsedPath + '(\\?(.*))?$');

      this.routes[path] = true;

      this.currentUrl = path;

      if (window.location.hash.substring(1).match(regex)) {
        const matches = window.location.hash.substring(1).match(regex);
        const params = {};

        for (let i = 0; i < paramNames.length; i++) {
          params[paramNames[i]] = matches[i + 1];
        }
        if (path.includes(":") && window.location.hash.substring(1).split("?")[1]) {
          console.error("Cannot use query params with path params", path, window.location.hash.substring(1).split("?")[1]);
          return false;
        }
        const query = {};

        const queryString = window.location.hash.substring(1).split('?')[1];
        if (queryString) {
          const queryParts = queryString.split('&');
          for (let i = 0; i < queryParts.length; i++) {
            const queryParam = queryParts[i].split('=');
            query[queryParam[0]] = queryParam[1];
          }
        }
        const req = {
          "params": params,
          "query": query,
          "url": window.location.hash.substring(1),
          "method": "POST",
        }


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
          setCookie: (name, value, options) => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            let cookieString = `${name}=${value};`;
            if (options) {
              if (options.path) {
                cookieString += `path=${options.path};`;
              }
              if (options.domain) {
                cookieString += `domain=${options.domain};`;
              }
              if (options.maxAge) {
                cookieString += `max-age=${options.maxAge};`;
              }
              if (options.httpOnly) {
                cookieString += `httpOnly=${options.httpOnly};`;
              }
              if (options.secure) {
                cookieString += `secure=${options.secure};`;
              }
              if (options.sameSite) {
                cookieString += `sameSite=${options.sameSite};`;
              }
            }
            document.cookie = cookieString;

          },
          getCookie: (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              const cookieName = cookie.split('=')[0];
              if (cookieName === name) {
                const cookieValue = cookie.split('=')[1];
                const cookieOptions = cookie.split(';').slice(1).map(option => {
                  const [key, value] = option.split('=').map(str => str.trim());
                  return { [key]: value };
                }).reduce((acc, curr) => Object.assign(acc, curr), {});
                return {
                  name: cookieName,
                  value: cookieValue
                };
              }
            }
            return null;
          },
          saveState: () => {
            if (hooked) {
              throw new Error("State has already been saved cannot save again");
            }
            const route = window.location.hash.substring(1);
            // save the current route in history
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
            } else {
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
            if (window.sessionStorage.getItem(route)) {
              window.location.hash = window.sessionStorage.getItem(route);
            } else {
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

            if (typeof code === 'number') {
              document.getElementById(this.rootElement).innerHTML = msg + "Code: " + code
              hooked = true;
            } else {
              throw new Error("Invalid status code");
            }



          },
          ip: () => {
            if (hooked) {
              throw new Error("Cannot send headers after they where already sent please refrain from using double res functions and call res.return() to resend to client");
            }
            hooked = true;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.ipify.org?format=json', false);
            xhr.onload = function () {
              if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                return data.ip;
              }
              else {
                console.log('IP Request Failed');
              }
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
            xhr.onload = function () {
              if (file.endsWith(".png" || ".jpg" || ".jpeg" || ".gif" || ".svg" || ".ico")) {
                document.getElementById(element).innerHTML = `<img src="${file}" />`;
              } else if (file.endsWith(".json")) {
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


window.ReactRouter = ReactRouter;
export default window.ReactRouter;

 