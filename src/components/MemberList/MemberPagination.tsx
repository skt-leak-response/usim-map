import { Button } from '@/components/ui/button';

interface MemberPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MemberPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MemberPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
      >
        {'<<'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
      >
        {'<'}
      </Button>
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
      >
        {'>'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-800 hover:text-white"
      >
        {'>>'}
      </Button>
    </div>
  );
}
