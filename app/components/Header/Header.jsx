"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultContent } from "@/lib/constants";
import HeaderContent from "./HeaderContent";

export default function Header({ content: passedContent }) {
  const [fetchedContent, setFetchedContent] = useState(null);
  const shouldFetch = !passedContent;

  useEffect(() => {
    if (!shouldFetch) return;

    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) throw new Error(`Failed to load content: ${response.status}`);
        const json = await response.json();
        const data = json?.data || json?.content;
        if (!cancelled) setFetchedContent(data || null);
      } catch (error) {
        if (!cancelled) {
          console.error("Header content fetch error:", error);
          setFetchedContent(null);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch]);

  const header = useMemo(() => {
    const source = passedContent ?? fetchedContent ?? defaultContent;
    return source?.header || defaultContent.header;
  }, [passedContent, fetchedContent]);

  return <HeaderContent header={header} />;
}
