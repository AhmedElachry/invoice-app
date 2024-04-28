import logo from "../assets/logo.png";
import profile from "../assets/image-avatar.jpg";
import sunIcon from "../assets/icon-sun.svg";
import moonIcon from "../assets/icon-moon.svg";
import useDarkMode from "../hooks/useDarkmode";
function Header() {
  const [colorTheme, setTheme] = useDarkMode();

  const toggleDarkMode = () => {
    setTheme(colorTheme);
  };

  return (
    <div className=" ">
      <header className="dark:bg-[#1E2139] bg-[#373b53] md:hidden ">
        <div className="flex justify-between items-center">
          <img className="h-[80px]" src={logo} alt="logo" />
          <div className="flex items-center gap-3">
            <img
              className="cursor-pointer transition-all duration-700 hover:scale-150"
              src={colorTheme === "dark" ? sunIcon : moonIcon}
              onClick={() => toggleDarkMode()}
            />
            <span className="h-[80px] w-[1px] bg-[#494e6e]" />
            <img
              src={profile}
              className="w-[50px] h-[50px] mx-5 rounded-full  "
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
