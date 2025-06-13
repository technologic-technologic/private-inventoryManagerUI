import { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
    searchName: string;
    setSearchName: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    availability: string;
    setAvailability: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchName, setSearchName] = useState('');
    const [availability, setAvailability] = useState('');
    const [category, setCategory] = useState('');

    return (
        <SearchContext.Provider value={{
            searchName, setSearchName,
            availability, setAvailability,
            category, setCategory}}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext debe usarse dentro de SearchProvider');
    }
    return context;
};
