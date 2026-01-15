import React from 'react';

export default function SearchFilter({ searchText, setSearchText, filters, setFilters, members }) {
  return (
    <div className="search-filter">
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search cards by title..."
      />
      <select
        value={filters.member || ''}
        onChange={(e) => setFilters({ ...filters, member: e.target.value || null })}
      >
        <option value="">All members</option>
        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <select
        value={filters.label || ''}
        onChange={(e) => setFilters({ ...filters, label: e.target.value || null })}
      >
        <option value="">All labels</option>
        <option value="frontend">frontend</option>
        <option value="backend">backend</option>
        <option value="urgent">urgent</option>
      </select>
    </div>
  );
}
