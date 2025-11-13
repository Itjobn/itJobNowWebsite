export default function Input({ label, type = "text", placeholder, value, onChange, name, required = false }) {
    if (type === "textarea") {
        return (
            <div className="mb-6">
                {label && (
                    <label htmlFor={name} className="block text-base font-semibold text-black mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
            </div>
        );
    }

    return (
        <div className="mb-6">
            {label && (
                <label htmlFor={name} className="block text-base font-semibold text-black mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
        </div>
    );
}

