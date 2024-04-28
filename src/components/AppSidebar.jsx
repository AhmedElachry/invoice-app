import logo from "../assets/logo.png";
import profile from "../assets/image-avatar.jpg";
import sunIcon from "../assets/icon-sun.svg";
import moonIcon from "../assets/icon-moon.svg";
import useDarkMode from "../hooks/useDarkmode";

function Sidebar() {
  const [colorTheme, setTheme] = useDarkMode();

  const toggleDarkMode = () => {
    setTheme(colorTheme);
  };

  return (
    <div className=" z-10 duration-300 ease-in-out fixed ">
      <aside className="dark:bg-[#1E2139] bg-[#373b53] hidden md:block w-[80px] h-screen rounded-br-2xl rounded-tr-2xl">
        <div className="flex flex-col justify-between h-full">
          <img className="w-[80px]" src={logo} alt="logo" />
          <div className="flex flex-col items-center gap-3">
            <img
              className="cursor-pointer transition-all duration-700 hover:scale-150"
              src={colorTheme === "dark" ? sunIcon : moonIcon}
              onClick={() => toggleDarkMode()}
            />
            <span className="w-[80px] h-[1px] bg-[#494e6e]" />
            <img
              src={profile}
              className="w-[50px] h-[50px] my-5 rounded-full  "
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
