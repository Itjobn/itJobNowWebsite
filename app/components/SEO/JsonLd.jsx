export default function JsonLd({ data, id }) {
    if (!data) return null;

    const jsonString = JSON.stringify(data, null, 2);

    if (!jsonString || jsonString === "{}" || jsonString === "[]") {
        return null;
    }

    const json = jsonString.replace(/</g, "\\u003c");


    return (
        <script
            type="application/ld+json"
            id={id}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: json }}
        />
    );
}

