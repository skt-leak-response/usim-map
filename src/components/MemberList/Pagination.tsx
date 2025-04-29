import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-end gap-4">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="md:h-8 md:px-3 h-6 px-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
        >
          {'<<'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="md:h-8 md:px-3 h-6 px-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
        >
          {'<'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="md:h-8 md:px-3 h-6 px-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
        >
          {'>'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="md:h-8 md:px-3 h-6 px-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
        >
          {'>>'}
        </Button>
      </div>
      <Label className="flex flex-col items-end justify-end md:gap-1 text-white">
        <div className="text-gray-400 w-full flex justify-end">
          페이지 {currentPage} of {totalPages}
        </div>
        <div className="md:block hidden">
          {startIndex} ~ {endIndex}명 / {totalItems}명
        </div>
      </Label>
    </div>
  );
}
