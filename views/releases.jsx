 

var logo = "./assets/images/visilogo.png";

function releases() {
  let version = props.version ? props.version : "v1.8.8";
  let [nav, setNav] = useState(false);

  useEffect(() => {
    const cleanup = dispose('./views/components/nav.jsx', (Page) => {
      setNav(<Page />);
    });

    return () => {
      cleanup();
    };
  }, []);

  return (
    <div>
      <div className="flex px-5 py-3 justify-center bg-sky-500 text-white mx-auto">
        <span className="flex hover:underline hover:cursor-pointer">
          <a
            href="https://opensource.fb.com/support-ukraine/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Ukraine 🇺🇦
          </a>
        </span>
      </div>
      {nav}

      <div className="flex inline mx-auto py-5  xl:mx-16 lg:mx-16 justify-start text-dark mt-10">
        <div className="">
          <div className="hero-content">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="mx-auto lg:ml-0">
                  <h1 className="lg:text-2xl md:text-6xl font-bold mx-auto text-black">
                    Release Cycle
                  </h1>
                  <p className="mt-6 lg:w-[80%] md:w-[70%] w-50 prose text-slate-500">
                    As of 6/12/2023, visi now supports rolling releases
                  </p>
                  <table className="table w-full mt-10">
                    <thead>
                      <tr>
                        <th>Release Model</th>
                        <th>Support Model</th>
                        <th>Release Cycle</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Rolling Release</td>
                        <td>Long Term Support</td>
                        <td>6 months - may have extensive support</td>
                      </tr>
                      <tr>
                        <td>Canary - Beta | Release</td>
                        <td>May be released as Stable but may have bugs</td>
                        <td>1 month - may have extensive support</td>
                      </tr>
                      <tr>
                        <td>Stable - LTS</td>
                        <td>Long Term Support</td>
                        <td>1 year - may have extensive support</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-center mt-10">
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
