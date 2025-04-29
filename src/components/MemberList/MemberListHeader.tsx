import { Member } from '@/types/members';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MemberListHeaderProps {
  currentPageMembers: Member[];
  selectedMembers: Member[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectAll: () => void;
}

export function MemberListHeader({
  currentPageMembers,
  selectedMembers,
  currentPage,
  totalPages,
  onPageChange,
  onSelectAll,
}: MemberListHeaderProps) {
  return (
    <Card className="bg-gray-900 border-none">
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div className="flex items-end space-x-2">
            <Checkbox
              checked={currentPageMembers.every((member) =>
                selectedMembers.some((m) => m.id === member.id),
              )}
              onCheckedChange={onSelectAll}
              className="border-2 border-white bg-transparent text-white data-[state=checked]:text-white data-[state=checked]:border-white focus:ring-0"
            />
            <Label className="text-gray-200">전체 선택</Label>
          </div>

          {totalPages > 1 && (
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
                  {(currentPage - 1) * 50 + 1} ~{' '}
                  {Math.min(currentPage * 50, currentPageMembers.length)}명 /{' '}
                  {currentPageMembers.length}명
                </div>
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
