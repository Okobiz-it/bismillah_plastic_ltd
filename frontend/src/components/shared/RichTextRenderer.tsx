"use client";

import { useMemo } from "react";

interface RichTextRendererProps {
  content: string;
  className?: string;
  clampLines?: number;
}

export default function RichTextRenderer({ content, className = "", clampLines }: RichTextRendererProps) {
  const finalContent = useMemo(() => {
    if (!content) return "";
    const trimmed = String(content).trim();
    if (!trimmed) return "";

    // Check if the content is HTML (contains tags like <p>, <span>, <div>, <ul>, etc.)
    const isHTML = /<\/?[a-z][\s\S]*>/i.test(trimmed);

    if (isHTML) {
      return trimmed;
    }

    // Convert plain text with newlines into HTML paragraphs and line breaks
    return trimmed
      .split(/\n{2,}/)
      .map((para) => `<p>${para.replace(/\n/g, "<br />")}</p>`)
      .join("");
  }, [content]);

  if (!finalContent) return null;

  return (
    <div 
      className={`prose max-w-none text-inherit break-words leading-relaxed ${clampLines ? `line-clamp-${clampLines}` : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: finalContent }}
    />
  );
}
