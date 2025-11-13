"use client";

import Link from "next/link";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

export default function AdminPreviewHeader({ header, onSave, isDirty, saving, onChangeHeader, onUploadLogo }) {
    const logo = header?.logo || {};
    const menu = header?.menu || [];
    const button = header?.button || {};

    return (
        <header className="w-full fixed top-0 left-0 bg-white z-100 border-b">
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <Link href={logo?.link || "/"} className="flex items-center min-w-0">
                    {logo?.image ? (
                        <EditableImage
                            src={logo.image}
                            alt={logo?.text || "Logo"}
                            className="h-16 w-auto cursor-pointer"
                            onUpload={onUploadLogo}
                        />
                    ) : (
                        <EditableText
                            className="font-bold text-primary text-xl truncate cursor-text"
                            value={logo?.text || "ITJobNow"}
                            onChange={(val) => onChangeHeader?.({ logo: { ...logo, text: val } })}
                        />
                    )}
                </Link>

                <nav className="hidden md:flex gap-10">
                    {menu.map((item, index) => (
                        <Link key={index} href={item.link || "#"} className={item.className || "font-switzer text-lg font-semibold"}>
                            <EditableText
                                value={item.label}
                                onChange={(val) => {
                                    const next = [...menu];
                                    next[index] = { ...next[index], label: val };
                                    onChangeHeader?.({ menu: next });
                                }}
                            />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {button?.text && (
                        <Link
                            href={button?.link || "/enroll"}
                            className={
                                "bg-primary text-white px-4 h-[60px] rounded-lg text-lg hover:bg-primary/90 transition-colors font-switzer font-semibold hidden md:flex items-center justify-center"
                            }
                        >
                            <EditableText
                                className="cursor-text"
                                value={button.text}
                                onChange={(val) => onChangeHeader?.({ button: { ...button, text: val } })}
                            />
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!isDirty || saving}
                        className={`px-4 h-[44px] rounded-lg text-sm font-semibold transition-colors border ${!isDirty || saving ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                    >
                        {saving ? "Saving..." : isDirty ? "Save changes" : "Saved"}
                    </button>
                </div>
            </div>
        </header>
    );
}


