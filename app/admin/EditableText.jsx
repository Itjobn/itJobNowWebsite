"use client";

import { useRef, useState } from "react";

export default function EditableText({ value, onChange, className, placeholder = "Click to edit" }) {
    const [editing, setEditing] = useState(false);
    const [temp, setTemp] = useState(null);
    const inputRef = useRef(null);

    const currentValue = temp ?? value ?? "";

    return editing ? (
        <input
            ref={inputRef}
            className={className}
            value={currentValue}
            placeholder={placeholder}
            onChange={(e) => setTemp(e.target.value)}
            autoFocus
            onBlur={() => {
                setEditing(false);
                if ((temp ?? value ?? "") !== (value ?? "")) onChange?.(temp ?? "");
                setTemp(null);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    inputRef.current?.blur();
                }
                if (e.key === "Escape") {
                    setTemp(null);
                    setEditing(false);
                }
            }}
        />
    ) : (
        <span className={className} onClick={() => setEditing(true)} role="button" title="Click to edit">
            {currentValue || <span className="opacity-50">{placeholder}</span>}
        </span>
    );
}


