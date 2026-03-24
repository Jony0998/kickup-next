import React, { createContext, useContext, useState, useCallback } from "react";

// Minimal Match type just for autocomplete
export interface SearchMatch {
    _id: string;
    matchTitle: string;
    matchTime: string;
    matchDate: string;
    location?: { city?: string; address?: string };
    fieldId?: any;
}

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    searchMatches: SearchMatch[];
    setSearchMatches: (m: SearchMatch[]) => void;
}

const SearchContext = createContext<SearchContextType>({
    searchQuery: "",
    setSearchQuery: () => { },
    searchMatches: [],
    setSearchMatches: () => { },
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);

    const handleSet = useCallback((q: string) => setSearchQuery(q), []);
    const handleSetMatches = useCallback((m: SearchMatch[]) => setSearchMatches(m), []);

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery: handleSet,
            searchMatches,
            setSearchMatches: handleSetMatches,
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
