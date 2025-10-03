'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, isExternalUrl } from '../lib/utils';

const SocialIcon = ({ platform }) => {
  switch ((platform || '').toLowerCase()) {
    case 'facebook':
      return (
        <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 512 512" stroke="#ffffff"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g id="7935ec95c421cee6d86eb22ecd11b7e3"> <path d="M283.122,122.174c0,5.24,0,22.319,0,46.583h83.424l-9.045,74.367h-74.379 c0,114.688,0,268.375,0,268.375h-98.726c0,0,0-151.653,0-268.375h-51.443v-74.367h51.443c0-29.492,0-50.463,0-56.302 c0-27.82-2.096-41.02,9.725-62.578C205.948,28.32,239.308-0.174,297.007,0.512c57.713,0.711,82.04,6.263,82.04,6.263 l-12.501,79.257c0,0-36.853-9.731-54.942-6.263C293.539,83.238,283.122,94.366,283.122,122.174z"> </path> </g> </g></svg>
      );
    case 'instagram':
      return (
        <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke=""><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#ffffff"></path> <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#ffffff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#ffffff"></path> </g></svg>
      );
    case 'youtube':
      return (
        <svg width="100px" height="100px" viewBox="0 -3 20 20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <title>youtube [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7442.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289" id="youtube-[#ffffff]"> </path> </g> </g> </g> </g></svg>
      );
    default:
      return null;
  }
};

const Footer = ({ themeOptions }) => {
  if (!themeOptions) return null;

  const bannerUrl = getImageUrl(themeOptions.footer_banner, '2048x2048') || themeOptions.footer_banner?.url;
  const footerLogo = themeOptions.footer_logo;
  const phone = themeOptions.footer_phone;
  const email = themeOptions.footer_email;
  const address = themeOptions.footer_address;
  const socials = Array.isArray(themeOptions.social_media_links) ? themeOptions.social_media_links : [];
  const menu = Array.isArray(themeOptions.main_menu) ? themeOptions.main_menu : [];

  return (
    <footer className="text-white bg-primary">
      <img
        src={bannerUrl}
        alt={themeOptions.footer_banner.alt || "Footer Banner"}
        className="w-full h-auto"
      />
      <div className="bg-primary/90">
        <div className="container py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Contact info */}
            <div className="space-y-5">
              {address && (
                <div className="flex">
                  <a href={`https://maps.google.com/?q=Signlab${address}`} className="text-lg font-bold flex items-center space-x-4" target='_blank'>
                    <Image
                      src="/images/place-icon.png"
                      alt="Place Icon"
                      width={54}
                      height={54}
                      priority
                    />
                    <span>{address}</span>
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex">
                  <a href={`tel:${phone}`} className="text-lg font-bold flex items-center space-x-4">
                    <Image
                      src="/images/phone-icon.png"
                      alt="Phone Icon"
                      width={54}
                      height={54}
                      priority
                    />
                    <span>{phone}</span>
                  </a>
                </div>
              )}
              {email && (
                <div className="flex">
                  <a href={`mailto:${email}`} className="text-lg font-bold flex items-center space-x-4">
                    <Image
                      src="/images/email-icon.png"
                      alt="Email Icon"
                      width={54}
                      height={54}
                      priority
                    />
                    <span>{email}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Logo + Socials */}
            <div className="flex flex-col items-start lg:items-end space-y-16">
              {footerLogo && (
                <a href="/" className="flex items-center">
                  {footerLogo ? (
                    <Image
                      src={footerLogo}
                      alt="Footer Logo"
                      width={400}
                      height={64}
                      priority
                      className="w-[180px] md:w-[260px] lg:w-[320px] 2xl:w-[400px] h-auto"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      SignLab
                    </span>
                  )}
                </a>
              )}
              {socials.length > 0 && (
                <div className="flex items-center space-x-4">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.social_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      title={s.platform}
                      className=" inline-flex rounded-md items-center justify-center w-12 h-12 bg-[#060054] text-primary transition p-2"
                    >
                      <SocialIcon platform={s.platform} />
                      <span className="sr-only">{s.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-primary">
        <div className="container pb-24">
          {menu.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-y-3 text-xl font-extrabold uppercase tracking-wide">
              {menu.map((item, idx) => {
                const target = item.open_in_new_tab ? '_blank' : undefined;
                const rel = item.open_in_new_tab ? 'noopener noreferrer' : undefined;
                const isExt = isExternalUrl(item.link);
                return (
                  <li key={idx} className="text-white px-6 border-r-4 last:border-r-0 leading-none">
                    {isExt ? (
                      <a
                        className="hover:text-[#7bb6ff]"
                        href={item.link || '#'}
                        target={target}
                        rel={rel}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <Link
                        className="hover:text-[#7bb6ff]"
                        href={item.link || '#'}
                        target={target}
                        rel={rel}
                      >
                        {item.text}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;


