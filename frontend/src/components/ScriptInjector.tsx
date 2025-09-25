'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Script as ScriptType } from '@/types';
import { endpoints } from '@/lib/api';

interface ScriptInjectorProps {
  location: 'head' | 'footer';
}

export default function ScriptInjector({ location }: ScriptInjectorProps) {
  const [scripts, setScripts] = useState<ScriptType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.getEnabled()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch scripts');
        }
        
        const allScripts: ScriptType[] = await response.json();
        
        // Filter scripts by location
        const locationScripts = allScripts.filter(script => script.locations.includes(location));
        setScripts(locationScripts);
      } catch (err) {
        console.error('Error fetching scripts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load scripts');
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, [location]);

  // Don't render anything while loading or if there's an error
  if (loading || error || scripts.length === 0) {
    return null;
  }

  return (
    <>
      {scripts.map((script) => {
        // Check if the script contains HTML tags (inline script)
        const isInlineScript = script.code.includes('<script') || !script.code.startsWith('http');
        
        if (isInlineScript) {
          // For inline scripts, use dangerouslySetInnerHTML
          return (
            <Script
              key={script.id}
              id={`custom-script-${script.id}`}
              strategy={location === 'head' ? 'beforeInteractive' : 'afterInteractive'}
              dangerouslySetInnerHTML={{
                __html: script.code
              }}
            />
          );
        } else {
          // For external scripts (URLs)
          return (
            <Script
              key={script.id}
              id={`custom-script-${script.id}`}
              src={script.code}
              strategy={location === 'head' ? 'beforeInteractive' : 'afterInteractive'}
            />
          );
        }
      })}
    </>
  );
}

// Component for head scripts specifically
export function HeadScripts() {
  return <ScriptInjector location="head" />;
}

// Component for footer scripts specifically  
export function FooterScripts() {
  return <ScriptInjector location="footer" />;
}
