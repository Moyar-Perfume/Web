"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cart from "@/components/shared/Cart";

const menuItems = [
  { name: "Recommendations", path: "/" },
  { name: "All Product", path: "/product-list" },
  { name: "Brand", path: "/brands" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const icons = [
  { src: "/icon/search.svg", alt: "Search" },
  { src: "/icon/user.svg", alt: "User" },
  { src: "/icon/cart.svg", alt: "Cart" },
];

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed w-full z-50 transition-all duration-300">
        {/* Free Shipping */}
        <div
          className={`bg-black text-white text-[12px] text-center leading-8 transition-all duration-300 ${
            scrollY > 50 ? "opacity-0" : "opacity-100"
          }`}
        >
          FREE worldwide shipping on discovery boxes!
        </div>

        {/* Navbar */}
        <section
          className={`w-full h-[100px] bg-white flex items-center justify-between transition-all duration-300 shadow-md ${
            scrollY > 50 ? "translate-y-[-32px]" : "translate-y-0"
          }`}
        >
          {/* Logo */}
          <div className="w-[250px] h-full flex items-center justify-center overflow-hidden">
            <a className="relative w-[250px] h-[250px]" href="/">
              <Image src="/logo/logo_no_bg/logo_black.png" fill alt="Logo" />
            </a>
          </div>

          {/* Menu */}
          <nav className="flex items-center gap-14">
            {menuItems.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                className="flex items-center uppercase font-gotu text-[18px] hover:text-gray-500 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-8 px-24">
            {icons.map((icon, index) => (
              <div
                key={index}
                className="relative w-[20px] h-[20px] cursor-pointer"
                onClick={() => {
                  if (icon.alt === "Cart") setIsCartOpen(true);
                }}
              >
                <Image src={icon.src} fill alt={icon.alt} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal giỏ hàng */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
