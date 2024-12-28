import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  countries: Country[];
}

export function CountrySelect({ value, onChange, countries }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(country => country.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full h-[42px] rounded-lg border border-gray-200 bg-white px-4 text-left text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2 h-full">
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="leading-none">{selectedCountry.name}</span>
          </div>
        ) : (
          <span className="text-gray-500 leading-none">请选择国家/地区</span>
        )}
        <ChevronDown className={`absolute right-3 top-[13px] h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <div className="max-h-60 overflow-auto">
            {countries.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className={`w-full h-[42px] px-4 text-left hover:bg-gray-50 flex items-center gap-2 ${
                  value === country.code ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="leading-none">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 