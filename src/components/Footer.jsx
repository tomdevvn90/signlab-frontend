'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isExternalUrl } from '../lib/utils';
import SocialIcon from './common/SocialIcon'

const Footer = ({ footerData }) => {
  // Always call hooks at the top level, before any return or conditional
  const pathname = usePathname();

  if (!footerData) return null;
  
  const bannerUrl = footerData.footer_banner;
  const footerLogo = footerData.footer_logo;
  const phone = footerData.footer_phone;
  const email = footerData.footer_email;
  const address = footerData.footer_address;
  const socials = Array.isArray(footerData.social_media_links) ? footerData.social_media_links : [];
  const menu = Array.isArray(footerData.main_menu) ? footerData.main_menu : [];

  return (
    <footer className="text-white bg-primary">
      <Image
        src={bannerUrl}
        alt={footerData.footer_banner.alt || "Footer Banner"}
        className="w-full h-auto"
        width={2048}
        height={400}
        priority={false}
        sizes="100vw"
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
                      className="overflow-hidden inline-flex rounded-md items-center justify-center w-12 h-12 bg-[#060054] text-primary transition p-2"
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
                        className={pathname === item.link ? 'text-[#7bb6ff]' : 'hover:text-[#7bb6ff]'}
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
