"use client";

import { useRef, useState } from "react";

export default function EditableImage({ src, alt, onUpload, className, accept = "image/*" }) {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setLoading(true);
            await onUpload?.(file);
        } finally {
            setLoading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={className} onClick={() => inputRef.current?.click()} />
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
            {loading && (
                <div className="absolute inset-0 bg-black/30 text-white flex items-center justify-center text-sm rounded">
                    Uploading...
                </div>
            )}
        </div>
    );
}


