const NavBar = () => {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            Blog Platform
          </a>
          <div>
            <button className="text-white hover:bg-gray-700 px-4 py-2 rounded">
              Home
            </button>
          </div>
        </div>
      </nav>
    );
  };
  
  export default NavBar;
  