import { Member } from '@/types/members';
import { Button } from '@/components/ui/button';

interface SelectedMembersProps {
  selectedMembers: Member[];
  onRemove: (id: Member['id']) => void;
  onNext: () => void;
}

export function SelectedMembers({ selectedMembers, onRemove, onNext }: SelectedMembersProps) {
  return (
    <div className="flex justify-between md:gap-3 md:flex-row flex-col gap-5">
      <div>
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <span
                key={member.id}
                className="inline-flex items-center bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white hover:from-fuchsia-500 hover:to-blue-400 rounded-full px-2 py-1 md:text-sm text-xs gap-1"
              >
                {member.name}
                <button onClick={() => onRemove(member.id)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <Button
        onClick={onNext}
        disabled={selectedMembers.length === 0}
        className="bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white hover:from-fuchsia-500 hover:to-blue-400 disabled:bg-gray-700 disabled:text-gray-400 border-0 shadow-lg"
      >
        Next ({selectedMembers.length}명 선택됨)
      </Button>
    </div>
  );
}
