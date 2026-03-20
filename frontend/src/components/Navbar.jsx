import React, { useState, useContext, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

const Navbar = ({ openAuth }) => {

const [isOpen, setIsOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [active, setActive] = useState("Home");
const [scrolled, setScrolled] = useState(false);
const [shakeCart, setShakeCart] = useState(false);

const { cartItems } = useContext(CartContext);
const { searchQuery, setSearchQuery } = useContext(SearchContext);

const navigate = useNavigate();
const location = useLocation();

const menuItems = [
{ name: "Home", type: "scroll", target: "hero" },
{ name: "Menu", type: "scroll", target: "menu" },
{ name: "About", type: "scroll", target: "about" },
{ name: "Tables", type: "route", target: "/tables" },
];

const menuRefs = useRef([]);
const underlineRef = useRef(null);

useEffect(() => {

const handleScrollEffect = () => {
setScrolled(window.scrollY > 20);
};

window.addEventListener("scroll", handleScrollEffect);

return () => window.removeEventListener("scroll", handleScrollEffect);

}, []);

useEffect(() => {

const index = menuItems.findIndex((item) => item.name === active);
const currentItem = menuRefs.current[index];

if (currentItem && underlineRef.current) {
underlineRef.current.style.width = `${currentItem.offsetWidth}px`;
underlineRef.current.style.left = `${currentItem.offsetLeft}px`;
}

}, [active]);

/* Scroll Spy */

useEffect(() => {

const sections = ["hero", "menu", "about"];

const handleScrollSpy = () => {

const scrollPosition = window.scrollY + 150;

sections.forEach((id) => {

const section = document.getElementById(id);

if (section) {

const top = section.offsetTop;
const height = section.offsetHeight;

if (scrollPosition >= top && scrollPosition < top + height) {

if (id === "hero") setActive("Home");
if (id === "menu") setActive("Menu");
if (id === "about") setActive("About");

}

}

});

};

window.addEventListener("scroll", handleScrollSpy);

return () => window.removeEventListener("scroll", handleScrollSpy);

}, []);

/* Cart Shake Animation */

useEffect(() => {

if (cartItems.length > 0) {

setShakeCart(true);

setTimeout(() => {
setShakeCart(false);
}, 500);

}

}, [cartItems]);

const handleScroll = (id, name) => {

setActive(name);

if (location.pathname !== "/") {

navigate("/", { state: { scrollTo: id } });

} else {

const section = document.getElementById(id);

if (section) section.scrollIntoView({ behavior: "smooth" });

}

setIsOpen(false);

};

const handleRoute = (path, name) => {

setActive(name);
navigate(path);
setIsOpen(false);

};

const handleSearchChange = (e) => {

const value = e.target.value;

setSearchQuery(value);

if (value.trim() !== "") {

const section = document.getElementById("menu");

if (section) section.scrollIntoView({ behavior: "smooth" });

}

};

return (

<>
<nav
className={`fixed w-full z-50 transition-all duration-300 border-b ${
scrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-md"
}`}
>

<div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

{/* Logo */}

<div
className="cursor-pointer"
onClick={() => handleScroll("hero", "Home")}
>

<img
src={logo}
alt="Bite Boss Logo"
className="h-20 w-auto object-contain hover:scale-105 transition"
/>

</div>

{/* Desktop Menu */}

<div className="hidden md:flex items-center">

<ul className="flex gap-10 text-gray-700 font-semibold relative">

{menuItems.map((item, index) => (

<li
key={index}
ref={(el) => (menuRefs.current[index] = el)}
className={`cursor-pointer transition ${
active === item.name
? "text-orange-500 font-bold"
: "hover:text-orange-500"
}`}
onClick={() =>
item.type === "route"
? handleRoute(item.target, item.name)
: handleScroll(item.target, item.name)
}
>

{item.name}

</li>

))}

<span
ref={underlineRef}
className="absolute -bottom-2 h-1 bg-orange-500 transition-all duration-300 rounded"
style={{ left: 0, width: 0 }}
></span>

</ul>

</div>

{/* Desktop Icons */}

<div className="hidden md:flex items-center gap-6">

<FaSearch
size={20}
onClick={() => setSearchOpen(!searchOpen)}
className="cursor-pointer text-gray-700 hover:text-orange-500"
/>

<div
className="relative cursor-pointer group"
onClick={() => handleRoute("/cart", "Cart")}
>

<FaShoppingCart
size={22}
className={`text-gray-700 group-hover:text-orange-500 transition ${
shakeCart ? "animate-bounce" : ""
}`}
/>

{cartItems.length > 0 && (

<span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">

{cartItems.length}

</span>

)}

</div>

<div
className="cursor-pointer group"
onClick={() => handleRoute("/profile", "Profile")}
>

<FaUserCircle
size={24}
className="text-gray-700 group-hover:text-orange-500"
/>

</div>

<button
onClick={openAuth}
className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition"
>

Sign Up

</button>

</div>

{/* Mobile */}

<div className="md:hidden flex items-center gap-4">

<button onClick={() => setIsOpen(true)}>
<FaBars size={22} />
</button>

</div>

</div>

{/* Animated Mobile Menu */}

<div
className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
isOpen ? "translate-x-0" : "translate-x-full"
}`}
>

<div className="flex justify-end p-4">

<button onClick={() => setIsOpen(false)}>
<FaTimes size={22} />
</button>

</div>

<ul className="flex flex-col gap-6 px-6 text-lg font-semibold">

{menuItems.map((item, index) => (

<li
key={index}
className={`cursor-pointer ${
active === item.name
? "text-orange-500"
: "hover:text-orange-500"
}`}
onClick={() =>
item.type === "route"
? handleRoute(item.target, item.name)
: handleScroll(item.target, item.name)
}
>

{item.name}

</li>

))}

</ul>

</div>

{/* Search */}

{searchOpen && (

<div className="absolute right-6 top-24 w-72 bg-white shadow-lg rounded-lg p-3 z-50">

<input
type="text"
value={searchQuery}
onChange={handleSearchChange}
placeholder="Search food..."
className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
/>

</div>

)}

</nav>

<div className="h-24"></div>

</>

);
};

export default Navbar;
