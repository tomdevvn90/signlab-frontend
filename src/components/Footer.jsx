'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isExternalUrl } from '../lib/utils';
import SocialIcon from './common/SocialIcon'

const Footer = ({ footerData, pageData }) => {
  // Always call hooks at the top level, before any return or conditional
  const pathname = usePathname();

  if (!footerData || pageData?.acf?.hide_footer) return null;
  
  const bannerUrl = footerData.footer_banner;
  const footerLogo = footerData.footer_logo;
  const phone = footerData.footer_phone || "08 8240 0925";
  const email = footerData.footer_email || "corey@signlab.com.au";
  const address = footerData.footer_address || "222 Port Road, Alberton, SA 5014";
  const socials = Array.isArray(footerData.social_media_links) ? footerData.social_media_links : [];
  const menu = Array.isArray(footerData.main_menu) ? footerData.main_menu : [];

  let aboveContent = pageData?.acf?.above_footer_content || 'show_banner';

  return (
    <footer className="text-white bg-primary">
      {bannerUrl && aboveContent === 'show_banner' && (
        <Image
          src={typeof bannerUrl === 'string' ? bannerUrl : bannerUrl.url || ''}
          alt={(typeof footerData.footer_banner === 'object' && footerData.footer_banner?.alt) || "Footer Banner"}
          className="w-full h-auto"
          width={2048}
          height={400}
          priority={false}
          sizes="100vw"
        />
      )}

      {address && aboveContent === 'show_map' && (
        <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=15&output=embed&iwloc=near`}
            className="w-full h-[60vh]"
            title="Google Map"
            allowFullScreen
            loading="lazy"
          ></iframe>
      )}
      <div className="bg-primary/90">
        <div className="container pt-16 pb-28 lg:pt-32 lg:pb-32">
          <div className="flex flex-col-reverse lg:flex-row  justify-between gap-12 lg:gap-8 items-start">
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
            <div className="flex flex-col items-start lg:items-end space-y-12 lg:space-y-16">
              {footerLogo && (
                <a href="/" className="flex items-center">
                  {footerLogo ? (
                    <Image
                      src={footerLogo}
                      alt="Footer Logo"
                      width={400}
                      height={64}
                      priority
                      className="w-[260px] lg:w-[320px] 2xl:w-[400px] h-auto"
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

      {/* Site Links */}
      <div style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="container py-14 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Get an Instant Quote */}
            <div className="col-span-2 lg:col-span-2">
              <h4 className="text-lg font-extrabold uppercase tracking-wide mb-4 text-white">Get an Instant Quote</h4>
              <p className="text-white/60 text-sm mb-5 leading-relaxed">Use our online calculators for a ballpark estimate in under 60 seconds. No sign-up needed.</p>
              <Link href="/quote-calculators" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-lg text-sm hover:bg-white/90 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>
                Quote Calculators
              </Link>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/40">Services</h4>
              <ul className="space-y-2.5">
                <li><Link href="/signage" className="text-white/70 hover:text-white text-sm transition-colors">Signage</Link></li>
                <li><Link href="/vehicle-wraps" className="text-white/70 hover:text-white text-sm transition-colors">Vehicle Wraps</Link></li>
                <li><Link href="/digital-signage" className="text-white/70 hover:text-white text-sm transition-colors">Digital Signage</Link></li>
                <li><Link href="/banners" className="text-white/70 hover:text-white text-sm transition-colors">Banners</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/40">Help</h4>
              <ul className="space-y-2.5">
                <li><Link href="/faq" className="text-white/70 hover:text-white text-sm transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white text-sm transition-colors">Contact Us</Link></li>
                <li><Link href="/about-us" className="text-white/70 hover:text-white text-sm transition-colors">About Signlab</Link></li>
                <li><Link href="/the-latest" className="text-white/70 hover:text-white text-sm transition-colors">News & Projects</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-primary hidden sm:block">
        <div className="container pb-24">
          {menu.length > 0 && (
            <ul className="flex flex-wrap flex-col sm:flex-row sm:items-center justify-center gap-y-5 text-xl font-extrabold uppercase tracking-wide">
              {menu.map((item, idx) => {
                const target = item.open_in_new_tab ? '_blank' : undefined;
                const rel = item.open_in_new_tab ? 'noopener noreferrer' : undefined;
                const isExt = isExternalUrl(item.link);
                return (
                  <li key={idx} className="text-white sm:px-[20px] sm:border-r-[3px] last:border-r-0 leading-none">
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

      <div className="block sm:hidden shadow-lg fixed z-[999] bottom-6 left-[50%] translate-x-[-50%] rounded-full bg-secondary">
        {phone && (
          <div className="flex">
            <div className="flex py-3 px-8 pr-6 whitespace-nowrap align-center text-base font-bold">{phone}</div>
            <a href={`tel:${phone}`} className="py-3 px-8 text-base font-bold flex items-center rounded-full bg-primary whitespace-nowrap uppercase">
              <span>Contact Us</span>
            </a>
          </div>
        )}
      </div>

    </footer>
  );
};

export default Footer;
