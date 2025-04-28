'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/types/members';
import { MEMBER_CONSTANTS } from '@/constants/members';

interface FilterState {
  party: string;
  committees: string;
  city: string;
  district: string;
  search: string;
}

const compressIds = (ids: number[]): string => {
  return ids.join('_');
};

const decompressIds = (compressed: string): number[] => {
  return compressed.split('_').map(Number);
};

export default function MemberList() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    party: '',
    committees: '',
    city: '',
    district: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
        setFilteredMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    let result = members;

    if (filters.party) {
      result = result.filter((member) => member.party === filters.party);
    }
    if (filters.committees) {
      result = result.filter((member) => member.committees.some((c) => c === filters.committees));
    }
    if (filters.city) {
      result = result.filter((member) => member.city === filters.city);
    }
    if (filters.district) {
      result = result.filter((member) => member.district === filters.district);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((member) => member.name.toLowerCase().includes(searchLower));
    }

    setFilteredMembers(result);
  }, [members, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleNext = () => {
    if (selectedMembers.length === 0) return;
    const memberIds = compressIds(selectedMembers.map((member) => member.id));
    router.push(`/email?ids=${memberIds}`);
  };

  const uniqueParties = Array.from(new Set(members.map((member) => member.party)));
  const uniqueCommittees = Array.from(new Set(members.flatMap((member) => member.committees)));
  const uniqueCities = Array.from(new Set(members.map((member) => member.city)));
  const uniqueDistricts = Array.from(new Set(members.map((member) => member.district)));

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={MEMBER_CONSTANTS.SEARCH.PLACEHOLDER}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.party}
          onChange={(e) => handleFilterChange('party', e.target.value)}
        >
          <option value="">{MEMBER_CONSTANTS.FILTERS.PARTY.PLACEHOLDER}</option>
          {uniqueParties.map((party) => (
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
          <option value="">{MEMBER_CONSTANTS.FILTERS.COMMITTEES.PLACEHOLDER}</option>
          {uniqueCommittees.map((committee) => (
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
          <option value="">{MEMBER_CONSTANTS.FILTERS.CITY.PLACEHOLDER}</option>
          {uniqueCities.map((city) => (
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
          <option value="">{MEMBER_CONSTANTS.FILTERS.DISTRICT.PLACEHOLDER}</option>
          {uniqueDistricts.map((district) => (
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
          onClick={() => {
            setFilters({
              party: '',
              committees: '',
              city: '',
              district: '',
              search: '',
            });
            setSelectedMembers([]);
          }}
        >
          {MEMBER_CONSTANTS.FILTERS.RESET}
        </button>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedMembers.length === 0}
          className={`px-4 py-2 rounded-md ${
            selectedMembers.length === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next ({selectedMembers.length}명 선택됨)
        </button>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center text-gray-400">No members found</div>
      ) : (
        <div className="space-y-2">
          {/* Select All Checkbox */}
          <div className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              checked={selectedMembers.length === filteredMembers.length}
              onChange={() => {
                if (selectedMembers.length === filteredMembers.length) {
                  setSelectedMembers([]);
                } else {
                  setSelectedMembers(filteredMembers);
                }
              }}
              className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">전체 선택</span>
          </div>
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`p-4 rounded-lg border ${
                selectedMembers.some((m) => m.id === member.id)
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedMembers.some((m) => m.id === member.id)}
                  onChange={() => handleMemberSelect(member)}
                  className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{member.name}</h3>
                      <p className="text-gray-400">{member.party}</p>
                    </div>
                    <span className="text-gray-400">
                      {member.city} {member.district}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.committees.map((committee, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {committee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
