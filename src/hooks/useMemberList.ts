import { useState, useEffect, useCallback } from 'react';
import { Member } from '@/types/members';

export interface FilterState {
  party: string | null;
  committees: string | null;
  city: string | null;
  district: string | null;
  search: string;
}

export interface UseMemberListProps {
  onSelectionChange: (selectedMembers: Member[]) => void;
}

export interface UseMemberListReturn {
  members: Member[];
  filteredMembers: Member[];
  selectedMembers: Member[];
  filters: FilterState;
  currentPage: number;
  totalPages: number;
  currentPageMembers: Member[];
  startIndex: number;
  endIndex: number;
  loading: boolean;
  error: string | null;
  setCurrentPage: (page: number) => void;
  removeMember: (id: Member['id']) => void;
  handleFilterChange: (key: keyof FilterState, value: string | null) => void;
  handleMemberClick: (member: Member) => void;
  handleSelectAll: () => void;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
}

const ITEMS_PER_PAGE = 50;

export function useMemberList({ onSelectionChange }: UseMemberListProps): UseMemberListReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    party: null,
    committees: null,
    city: null,
    district: null,
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching members');
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
    setCurrentPage(1);
  }, [members, filters]);

  useEffect(() => {
    onSelectionChange(selectedMembers);
  }, [selectedMembers, onSelectionChange]);

  const removeMember = useCallback((id: Member['id']) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleMemberClick = useCallback((member: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      return isSelected ? prev.filter((m) => m.id !== member.id) : [...prev, member];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const currentPageMembers = filteredMembers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
    const allSelected = currentPageMembers.every((member) =>
      selectedMembers.some((m) => m.id === member.id),
    );

    if (allSelected) {
      setSelectedMembers((prev) =>
        prev.filter((member) => !currentPageMembers.some((m) => m.id === member.id)),
      );
    } else {
      const newSelections = currentPageMembers.filter(
        (member) => !selectedMembers.some((m) => m.id === member.id),
      );
      setSelectedMembers((prev) => [...prev, ...newSelections]);
    }
  }, [currentPage, filteredMembers, selectedMembers]);

  const resetFilters = useCallback(() => {
    setFilters({
      party: null,
      committees: null,
      city: null,
      district: null,
      search: '',
    });
  }, []);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const currentPageMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length);

  return {
    members,
    filteredMembers,
    selectedMembers,
    filters,
    currentPage,
    totalPages,
    currentPageMembers,
    startIndex,
    endIndex,
    loading,
    error,
    setCurrentPage,
    removeMember,
    handleFilterChange,
    handleMemberClick,
    handleSelectAll,
    setFilters,
    resetFilters,
  };
}
