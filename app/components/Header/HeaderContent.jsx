"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function HeaderContent({ header }) {
    const { logo, menu, button } = header || {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const normalizedMenu = useMemo(() => {
        if (!Array.isArray(menu)) return [];
        return menu.map((item) => {
            if (!item?.link || typeof item.link !== "string") return item;
            if (item.link.startsWith("#")) {
                return { ...item, link: `/${item.link}` };
            }
            return item;
        });
    }, [menu]);

    const resolvedButton = useMemo(() => {
        if (!button?.link || typeof button.link !== "string") return button;
        if (button.link.startsWith("#")) {
            return { ...button, link: `/${button.link}` };
        }
        return button;
    }, [button]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="w-full fixed top-0 left-0 bg-white z-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between relative">
                {/* Logo */}
                <Link href={logo?.link || "/"} className="flex items-center">
                    {logo?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logo.image}
                            alt={logo?.text || "Logo"}
                            className="h-16 w-auto"
                        />
                    ) : (
                        <div className="font-bold text-primary text-xl">
                            {logo?.text || "ITJobNow"}
                        </div>
                    )}
                </Link>

                {/* Navigation Menu - Desktop */}
                <nav className="hidden md:flex gap-10">
                    {normalizedMenu?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link || "#"}
                            className={item.className || "font-switzer text-lg font-semibold"}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA - Desktop */}
                {button?.text && (
                    <Link
                        href={resolvedButton?.link || "/enroll"}
                        className="hidden md:flex bg-primary text-white px-4 h-[60px] rounded-lg text-lg hover:bg-primary/90 transition-colors font-switzer font-semibold items-center justify-center"
                    >
                        {button.text}
                    </Link>
                )}

                {/* Mobile Menu Button */}
                <div className="md:hidden ml-auto relative">
                    <button
                        type="button"
                        onClick={toggleMenu}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Toggle navigation menu</span>
                        <svg
                            className="h-6 w-6 text-neutral-900"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-4 top-[calc(100%+0.75rem)] w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
                            <nav className="flex flex-col gap-2">
                                {normalizedMenu?.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link || "#"}
                                        onClick={closeMenu}
                                        className={
                                            item.className ||
                                            "font-switzer text-base font-semibold text-neutral-900 hover:text-primary transition-colors"
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {button?.text && (
                                <Link
                                    href={resolvedButton?.link || "/enroll"}
                                    onClick={closeMenu}
                                    className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-lg font-semibold text-white transition-colors hover:bg-primary/90"
                                >
                                    {button.text}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


