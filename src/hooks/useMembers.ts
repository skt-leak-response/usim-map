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

export function useMembers() {
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

  const resetFilters = () => {
    setFilters({
      party: '',
      committees: '',
      city: '',
      district: '',
      search: '',
    });
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

  return {
    members,
    filters,
    loading,
    selectedMembers,
    parties,
    committees,
    cities,
    districts,
    handleFilterChange,
    resetFilters,
    toggleMemberSelection,
    toggleSelectAll,
  };
}
