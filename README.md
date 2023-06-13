 
<h1 align="center"> <div inline="true" align="center">Visi.js  <img src="./logo.svg" width="40" height="40"></div> </h1>

 

<div align="center">
  <strong>Visi.js is a new way to build single page applications!</strong>
    <br>
  <a href="https://visijs.postr-inc.me/">Website - built with visi.js</a>
    |
  <a href="https://visijs.postr-inc.me/#/docs/en-US/v1.8.8/intro">Docs</a>
  <br>
    <sub>Built with ❤︎ & maintained by
        <a href="https://github.com/MalikWhitten67">Malik Whitten</a> 
    </sub>
  
    
</div>
 
#  why use visi?:

Visi.js is not a framework -> it is a library built to add multi page functionality & ease of use to single page applications.

Features:
 
* Fast asynchronous component compiling & loading
* Express.js like hash router & history router
* Multiple nodejs like libraries for client side use
* CFR | (component first rendering) -  cache first rendering
* Full typescript support
* Multiple libraries optimized to work with visi.js!

 
 
# whats new in v1.9.1-canary
- visi now is testing gzip compression for components, this will allow for smaller component sizes and faster loading times. though we cannot guarantee this will be in the stable build!
- rolling releases, each release including this one once stable will be supported for updates regularly up to 5 months after release. this is to ensure that visi.js is always up to date and secure - even for older versions. 
 * why wasnt this added before?
    - Most of the time many issues are fixed as soon as they were found in the next release. Which made keeping older versions up to date a pain. Now since visi is at a stable point we can start from now on including older versions in the update cycle. 

# whats been changed
- alot of logging, fixing security vunerabilities, and fixing a few bugs :)


# installation

```bash
npx visiapp@latest create <project-name>
```

#  usage

```bash
cd <project-name>
visiapp serve --port <port> 
```
 

  
 

##  Contributing

See [the contributing file](https://github.com/Postr-Inc/visi.js/blob/main/CONTRIBUTING.md)!

 
PRs accepted.

 
