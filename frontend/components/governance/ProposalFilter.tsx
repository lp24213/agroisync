'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface ProposalFilterProps {
  onSearch: (term: string) => void;
  onFilter: (status: string) => void;
  onSort: (sortBy: string) => void;
  currentFilter: string;
  currentSort: string;
}

export function ProposalFilter({
  onSearch,
  onFilter,
  onSort,
  currentFilter,
  currentSort,
}: ProposalFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterClick = (status: string) => {
    onFilter(status);
    setIsFilterOpen(false);
  };

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0'>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search proposals'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-10 pr-4 py-2 bg-agro-dark/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors w-full md:w-64'
          />
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-3 py-1 rounded-lg text-sm ${currentFilter === 'all' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterClick('active')}
            className={`px-3 py-1 rounded-lg text-sm ${currentFilter === 'active' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
          >
            Active
          </button>
          <button
            onClick={() => handleFilterClick('passed')}
            className={`px-3 py-1 rounded-lg text-sm ${currentFilter === 'passed' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
          >
            Passed
          </button>
          <button
            onClick={() => handleFilterClick('rejected')}
            className={`px-3 py-1 rounded-lg text-sm ${currentFilter === 'rejected' ? 'bg-agro-blue text-white' : 'bg-agro-dark/50 text-gray-300 hover:bg-agro-dark/80'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <span className='text-sm text-gray-400'>Sort by:</span>
        <select
          value={currentSort}
          onChange={e => onSort(e.target.value)}
          className='bg-agro-dark/50 border border-gray-700 rounded-lg text-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-agro-blue transition-colors text-sm'
        >
          <option value='newest'>Newest</option>
          <option value='oldest'>Oldest</option>
          <option value='most_votes'>Most Votes</option>
        </select>
      </div>
    </div>
  );
}
