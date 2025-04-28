'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/types/members';
import { MEMBER_CONSTANTS } from '@/constants/members';
import { encodeIds } from '@/utils/encoding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import MemberCard from './MemberCard';
import MemberFilters from './MemberFilters';
import MemberPagination from './MemberPagination';
import MemberListSkeleton from './MemberListSkeleton';

interface FilterState {
  party: string | null;
  committees: string | null;
  city: string | null;
  district: string | null;
  search: string;
}

interface MemberListProps {
  onSelectionChange: (selectedMembers: Member[]) => void;
}

const ITEMS_PER_PAGE = 50;

export default function MemberList({ onSelectionChange }: MemberListProps) {
  const router = useRouter();
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
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, [members, filters]);

  useEffect(() => {
    onSelectionChange(selectedMembers);
  }, [selectedMembers, onSelectionChange]);

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      return isSelected ? prev.filter((m) => m.id !== member.id) : [...prev, member];
    });
  };

  const handleSelectAll = () => {
    const currentPageMembers = filteredMembers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
    const allSelected = currentPageMembers.every((member) =>
      selectedMembers.some((m) => m.id === member.id),
    );

    if (allSelected) {
      // 현재 페이지의 멤버들만 선택 해제
      setSelectedMembers((prev) =>
        prev.filter((member) => !currentPageMembers.some((m) => m.id === member.id)),
      );
    } else {
      // 현재 페이지의 멤버들 중 선택되지 않은 것들만 추가
      const newSelections = currentPageMembers.filter(
        (member) => !selectedMembers.some((m) => m.id === member.id),
      );
      setSelectedMembers((prev) => [...prev, ...newSelections]);
    }
  };

  const handleNext = () => {
    if (selectedMembers.length === 0) return;
    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const currentPageMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Suspense fallback={<div>필터 로딩 중...</div>}>
          <MemberFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => {
              setFilters({
                party: null,
                committees: null,
                city: null,
                district: null,
                search: '',
              });
            }}
            members={members}
          />
        </Suspense>
      </ErrorBoundary>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={selectedMembers.length === 0}
          className="bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white hover:from-fuchsia-500 hover:to-blue-400 disabled:bg-gray-700 disabled:text-gray-400 border-0 shadow-lg"
        >
          Next ({selectedMembers.length}명 선택됨)
        </Button>
      </div>

      {loading ? (
        <MemberListSkeleton />
      ) : filteredMembers.length === 0 ? (
        <div className="text-center text-gray-400">No members found</div>
      ) : (
        <div className="space-y-2">
          {totalPages > 1 && (
            <MemberPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          <div className="text-gray-400 w-full flex justify-end px-4">
            페이지 {currentPage} of {totalPages}
          </div>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={currentPageMembers.every((member) =>
                      selectedMembers.some((m) => m.id === member.id),
                    )}
                    onCheckedChange={handleSelectAll}
                    className="border-2 border-white bg-transparent text-white data-[state=checked]:text-white data-[state=checked]:border-white focus:ring-0"
                  />
                  <Label className="text-gray-200">전체 선택</Label>
                </div>

                <Label className="flex flex-col items-end space-y-1 text-white">
                  <div>
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} ~
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)}명 /
                    {filteredMembers.length}명
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>

          <ErrorBoundary>
            <Suspense fallback={<MemberListSkeleton />}>
              {currentPageMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isSelected={selectedMembers.some((m) => m.id === member.id)}
                  onSelect={handleMemberClick}
                />
              ))}
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
