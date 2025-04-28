import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Member } from '@/types/members';

interface MemberCardProps {
  member: Member;
  isSelected: boolean;
  onSelect: (member: Member) => void;
}

export default function MemberCard({ member, isSelected, onSelect }: MemberCardProps) {
  return (
    <Card
      className={`${isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(member)}
            className="border-2 border-white bg-transparent text-white data-[state=checked]:text-white data-[state=checked]:border-white focus:ring-0"
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
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
                >
                  {committee}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
