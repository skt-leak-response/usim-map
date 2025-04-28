'use client';
import { useState, useEffect } from 'react';
import type { Member } from '@/types/members';
import membersData from '@/data/members.json';

interface FilterState {
  party: string;
  committees: string;
  city: string;
  district: string;
  search: string;
}

export default function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    party: '',
    committees: '',
    city: '',
    district: '',
    search: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  // Get unique values for filters
  const parties = Array.from(new Set(membersData.map((m) => m.party)));
  const committees = Array.from(new Set(membersData.flatMap((m) => m.committees)));
  const cities = Array.from(new Set(membersData.map((m) => m.city)));

  // Get districts based on selected city
  const districts = filters.city
    ? Array.from(new Set(membersData.filter((m) => m.city === filters.city).map((m) => m.district)))
    : [];

  const filterMembers = () => {
    setLoading(true);
    let filtered = membersData;

    if (filters.search) {
      filtered = filtered.filter((member) =>
        member.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    if (filters.party) {
      filtered = filtered.filter((member) => member.party === filters.party);
    }
    if (filters.committees) {
      filtered = filtered.filter((member) => member.committees.includes(filters.committees));
    }
    if (filters.city) {
      filtered = filtered.filter((member) => member.city === filters.city);
    }
    if (filters.district) {
      filtered = filtered.filter((member) => member.district === filters.district);
    }

    setMembers(filtered);
    setLoading(false);
  };

  useEffect(() => {
    filterMembers();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (key === 'city') {
      setFilters((prev) => ({
        ...prev,
        city: value,
        district: '', // Reset district when city changes
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMembers.size === members.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(members.map((m) => m.name)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="이름으로 검색"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.party}
          onChange={(e) => handleFilterChange('party', e.target.value)}
        >
          <option value="">정당 선택</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.committees}
          onChange={(e) => handleFilterChange('committees', e.target.value)}
        >
          <option value="">위원회 선택</option>
          {committees.map((committee) => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        >
          <option value="">시/도 선택</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.district}
          onChange={(e) => handleFilterChange('district', e.target.value)}
          disabled={!filters.city}
        >
          <option value="">지역구 선택</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Filter reset button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() =>
            setFilters({
              party: '',
              committees: '',
              city: '',
              district: '',
              search: '',
            })
          }
        >
          필터 초기화
        </button>
      </div>

      {/* Members list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {members.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
              <input
                type="checkbox"
                checked={selectedMembers.size === members.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300">전체 선택</span>
            </div>
          )}

          {members.map((member) => (
            <div
              key={member.name}
              className={`p-4 rounded-lg border transition-colors ${
                selectedMembers.has(member.name)
                  ? 'bg-blue-900/30 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedMembers.has(member.name)}
                  onChange={() => toggleMemberSelection(member.name)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <p className="text-blue-400">{member.party}</p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300">
                      {member.election_count}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-300">
                      <span className="text-gray-400">지역구:</span> {member.city} {member.district}
                    </p>
                    <div>
                      <p className="text-gray-400 text-sm">소속위원회:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {member.committees.map((committee: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-md bg-gray-700 text-gray-300"
                          >
                            {committee}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="text-center py-8 text-gray-400">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
