'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/types/members';
import { encodeIds } from '@/utils/encoding';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import MemberCard from './MemberCard';
import MemberFilters from './MemberFilters';
import MemberPagination from './MemberPagination';
import MemberListSkeleton from './MemberListSkeleton';
import { SelectedMembers } from './SelectedMembers';
import { MemberListHeader } from './MemberListHeader';
import { useMemberList } from '@/hooks/useMemberList';

interface MemberListProps {
  onSelectionChange: (selectedMembers: Member[]) => void;
}

export default function MemberList({ onSelectionChange }: MemberListProps) {
  const router = useRouter();
  const {
    members,
    filteredMembers,
    selectedMembers,
    filters,
    currentPage,
    totalPages,
    currentPageMembers,
    loading,
    error,
    setCurrentPage,
    removeMember,
    handleFilterChange,
    handleMemberClick,
    handleSelectAll,
    setFilters,
    resetFilters,
  } = useMemberList({ onSelectionChange });

  const handleNext = () => {
    if (selectedMembers.length === 0) return;
    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

  if (loading) {
    return <MemberListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Suspense fallback={<div>필터 로딩 중...</div>}>
          <MemberFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            members={members}
          />
        </Suspense>
      </ErrorBoundary>

      <SelectedMembers
        selectedMembers={selectedMembers}
        onRemove={removeMember}
        onNext={handleNext}
      />

      {filteredMembers.length === 0 ? (
        <div className="text-center text-gray-400">No members found</div>
      ) : (
        <div className="space-y-2">
          <MemberListHeader
            currentPageMembers={currentPageMembers}
            selectedMembers={selectedMembers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSelectAll={handleSelectAll}
          />

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

      {totalPages > 1 && (
        <MemberPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
