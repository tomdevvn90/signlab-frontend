'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = ({ headerData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Track which submenu is open by index
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const pathname = usePathname();
  const logoUrl = headerData?.header_logo || '';
  const logoMobileUrl = headerData?.header_logo_mobile || '';
  const menuData = headerData?.main_menu || [];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close all submenus when closing main menu
    if (isMenuOpen) setOpenSubMenuIndex(null);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenSubMenuIndex(null);
  };
  // Toggle submenu for a given index
  const toggleSubMenu = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Determine header classes based on menu state
  const headerClassName = [
    "fixed md:absolute left-0 right-0 z-[999] transition-all duration-200",
    isMenuOpen ? "bg-[rgb(0_81_188_/_0.98)] h-[100vh]" : "bg-transparent h-[150px]"
  ].join(' ');

  return (
    <header className={headerClassName}>
      <div className="mx-auto">
        <div className="flex justify-between items-center px-6 py-6 md:px-8 md:py-8 lg:px-12 2xl:py-14 2xl:px-20 bg-white md:bg-transparent shadow-sm sm:shadow-none">
          {/* Logo */}
          <div className="flex items-center">
            <button className="flex items-center" onClick={toggleMenu}>
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="SignLab Logo"
                  width={280}
                  height={50}
                  className="hidden md:block w-[180px] md:w-[240px] lg:w-[280px] h-auto"
                  priority
                />
              ) : (
                <span className="text-4xl font-bold text-white uppercase">
                  SignLab
                </span>
              )}
              {logoMobileUrl ? (
                <Image
                  src={logoMobileUrl}
                  alt="SignLab Logo"
                  width={280}
                  height={50}
                  className="md:hidden w-[180px] md:w-[240px] lg:w-[280px] h-auto"
                  priority
                />
              ) : (
                <span className="text-4xl font-bold text-primary uppercase">
                  SignLab
                </span>
              )}
            </button>
          </div>

          {/* Toggle Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-primary md:text-white duration-200"
            aria-label="Toggle menu"
          >
            <svg 
              id="toggle-menu-button-icon"
              className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
            </svg>
          </button>
        </div>

        {/* Main Menu */}
        {isMenuOpen && (
          <nav className="px-6 2xl:px-20 slide-in-right py-16 md:py-0">
            <ul className="">
              {menuData && menuData.map((item, index) => {
                const hasSubMenu = item.sub_menu && item.sub_menu.length > 0;
                const isSubMenuOpen = openSubMenuIndex === index;
                return (
                  item.text && item.link && (
                    <li key={index} className="text-center md:text-right text-white text-4xl lg:text-5xl" onClick={() => toggleSubMenu(index)}>
                      <div className="flex align-center justify-center md:justify-end my-5 lg:my-6">
                        {hasSubMenu && (
                          <button
                            className={`ml-4 inline-flex items-center text-white duration-200 text-5xl uppercase font-extrabold hover:text-[#7bb6ff] ${isSubMenuOpen ? 'rotate-180' : ''}`}
                            type="button"
                            aria-label={`${item.text} menu`}
                            tabIndex={0}
                            style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                            onClick={() => toggleSubMenu(index)}
                          >
                            <svg className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="square" strokeLinejoin="square" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        {(item.open_in_new_tab === true) ? (
                          <a
                            href={item.link}
                            className="inline-block px-2 duration-200 uppercase font-extrabold hover:text-[#7bb6ff]"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                          >
                            {item.text}
                          </a>
                        ) : (
                          <Link
                            href={item.link}
                            className={`inline-block px-2 duration-200 uppercase font-extrabold ${
                              pathname === item.link ? 'text-[#7bb6ff]' : 'hover:text-[#7bb6ff]'
                            }`}
                            onClick={closeMenu}
                          >
                            {item.text}
                          </Link>
                        )}
                      </div>

                      {/* Submenu */}
                      {hasSubMenu && isSubMenuOpen && (
                        <ul className="pr-4 border-r-4 border-gray-200 mr-4">
                          {item.sub_menu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              {(subItem.open_in_new_tab === true) ? (
                                <a
                                  href={subItem.link}
                                  className="inline-block px-2 py-3 text-white duration-200 text-3xl uppercase font-extrabold hover:text-[#7bb6ff]"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={closeMenu}
                                >
                                  {subItem.text}
                                </a>
                              ) : (
                                <Link
                                  href={subItem.link}
                                  className={`inline-block px-2 py-3 text-white duration-200 text-3xl uppercase font-extrabold ${
                                    pathname === subItem.link ? 'text-[#7bb6ff]' : 'hover:text-[#7bb6ff]'
                                  }`}
                                  onClick={closeMenu}
                                >
                                  {subItem.text}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
