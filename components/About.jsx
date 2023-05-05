let Nav = require('./components/Nav.jsx');
let CodeBlock = require('./components/Code.jsx');

const About = () => {
    return (
        <div>
            <Nav active="about" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 text-center">
                    <div className="text-start overflow-hidden shadow-sm sm:rounded-lg">
                        <p className="text-center text-sky-300 text-2xl ">Our Goal</p>
                        <p style={{ width: "75%", margin: "auto", marginTop: "30px" }} className="text-white text-4xl shadow-lg font-bold w-15 mx-auto mt-6 text-center">
                            Enhancing the way static SPA applications are built
                        </p>
                        <p style={{ width: "75%", margin: "auto", marginTop: "30px" }} className="text-slate-200 text-lg mt-6 text-center">
                            Visi.js is a library that streamlines the development of single-page applications by abstracting away complexity and enabling multi-page functionality
                        </p>

                        
                        <div className="flex justify-center mt-20">
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-white text-2xl font-bold">Made By</p>
                                <a href="https://malik.isadev.ga">
                                    <img className="h-12 mt-5 w-12 rounded mr-2 mx-4" src="https://github.com/Postr-Inc/postr-inc.me/blob/main/assets/img/round.png?raw=true" alt="Malik's Logo" />
                                     
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <footer className="w-full py-8  fixed  bottom-0  ">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="flex   justify-between">
                        <div className="flex items-center">
                            <p className="text-white text-xl font-bold">Built With</p>
                            <img className="h-8 w-8 rounded mr-2 mx-4" src="./components/static/images/visilogo.png" alt="Visi.js Logo" />
                        </div>


                        <div>
                            <div className="flex float-right  ">
                                <i className="fa-brands text-white text-2xl fa-github"></i>
                                <i className="fa-brands text-white text-2xl fa-discord mx-6"></i>
                                <i className="fa-brands text-white text-2xl fa-twitter mx-5"></i>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-between mt-8">
                        <div className="flex items-center">
                            <p className="text-white text-sm font-semibold">© 2023 Visi.js All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};
