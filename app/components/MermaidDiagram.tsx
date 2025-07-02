"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  id: string;
  chart: string;
}

export default function MermaidDiagram({ id, chart }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        
        // Configure mermaid theme based on current theme
        const mermaidTheme = theme === "dark" ? "dark" : "base";
        
        mermaid.initialize({
          startOnLoad: false,
          theme: mermaidTheme,
          securityLevel: "loose",
          fontFamily: "inherit",
          fontSize: 16,
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            useMaxWidth: true,
            nodeSpacing: 50,
            rankSpacing: 80,
          },
          themeVariables: {
            primaryColor: theme === "dark" ? "#6B5CFF" : "#3B82F6",
            primaryTextColor: theme === "dark" ? "#ffffff" : "#000000",
            primaryBorderColor: theme === "dark" ? "#6B5CFF" : "#3B82F6",
            lineColor: theme === "dark" ? "#9CA3AF" : "#4B5563",
            secondaryColor: theme === "dark" ? "#374151" : "#E5E7EB",
            tertiaryColor: theme === "dark" ? "#1F2937" : "#F9FAFB",
            background: theme === "dark" ? "#111827" : "#ffffff",
            mainBkg: theme === "dark" ? "#374151" : "#F3F4F6",
            secondBkg: theme === "dark" ? "#4B5563" : "#E5E7EB",
            cScale0: theme === "dark" ? "#1F2937" : "#F9FAFB",
            cScale1: theme === "dark" ? "#374151" : "#F3F4F6",
            cScale2: theme === "dark" ? "#4B5563" : "#E5E7EB",
          },
        });

        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = "";
          const uniqueId = `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
          const { svg } = await mermaid.render(uniqueId, chart);
          mermaidRef.current.innerHTML = svg;
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading mermaid:", error);
      }
    };

    loadMermaid();
  }, [id, chart, theme]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6 shadow-sm overflow-x-auto">
        <div 
          ref={mermaidRef} 
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ minHeight: "400px" }}
        />
        {!isLoaded && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
} 