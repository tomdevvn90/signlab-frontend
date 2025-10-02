'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getImageAlt, formatMenuData, isExternalUrl } from '../lib/utils';

const Header = ({ logoData, menuData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  
  const formattedMenu = formatMenuData(menuData);
  const logoUrl = getImageUrl(logoData);
  const logoAlt = getImageAlt(logoData, 'Logo');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderMenuItem = (item, index) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExternal = isExternalUrl(item.link);

    return (
      <li key={index} className="relative group">
        {isExternal ? (
          <a
            href={item.link}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.text}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <Link
            href={item.link}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
            onClick={closeMenu}
          >
            {item.text}
            {hasSubmenu && (
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>
        )}
        
        {/* Dropdown Submenu */}
        {hasSubmenu && (
          <ul className="absolute left-0 top-full w-48 bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.submenu.map((subItem, subIndex) => (
              <li key={subIndex}>
                {isExternalUrl(subItem.link) ? (
                  <a
                    href={subItem.link}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {subItem.text}
                  </a>
                ) : (
                  <Link
                    href={subItem.link}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
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
    );
  };

  return (
    <header className="bg-transparent absolute left-0 right-0 z-[999]">
      <div className="container">
        <nav className="flex justify-between items-center py-28">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={363}
                  height={56}
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-gradient">
                  SignLab
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:hidden lg:flex">
            <ul className="flex items-center space-x-1">
              {formattedMenu.map((item, index) => renderMenuItem(item, index))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="">
            <button
              // onClick={toggleMenu}
              className="text-white duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <ul className="py-2">
              {formattedMenu.map((item, index) => (
                <li key={index}>
                  <div>
                    {isExternalUrl(item.link) ? (
                      <a
                        href={item.link}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                        onClick={closeMenu}
                      >
                        {item.text}
                      </Link>
                    )}
                  </div>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && item.submenu.length > 0 && (
                    <ul className="pl-4 border-l border-gray-200 ml-4">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          {isExternalUrl(subItem.link) ? (
                            <a
                              href={subItem.link}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMenu}
                            >
                              {subItem.text}
                            </a>
                          ) : (
                            <Link
                              href={subItem.link}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
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
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
