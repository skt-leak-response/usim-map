import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MEMBER_CONSTANTS } from '@/constants/members';
import { Member } from '@/types/members';

interface FilterState {
  party: string | null;
  committees: string | null;
  city: string | null;
  district: string | null;
  search: string;
}

interface MemberFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | null) => void;
  onReset: () => void;
  members: Member[];
}

export default function MemberFilters({
  filters,
  onFilterChange,
  onReset,
  members,
}: MemberFiltersProps) {
  const uniqueParties = Array.from(new Set(members.map((member) => member.party))).filter(Boolean);
  const uniqueCommittees = Array.from(
    new Set(members.flatMap((member) => member.committees)),
  ).filter(Boolean);
  const uniqueCities = Array.from(new Set(members.map((member) => member.city))).filter(Boolean);
  const uniqueDistricts = Array.from(new Set(members.map((member) => member.district))).filter(
    Boolean,
  );

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder={MEMBER_CONSTANTS.SEARCH.PLACEHOLDER}
        value={filters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFilterChange('search', e.target.value)
        }
        className="bg-gray-900 border-white text-gray-100 placeholder:text-gray-500 border-2 focus:border-white focus:ring-0"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          value={filters.party || 'none'}
          onValueChange={(value: string) =>
            onFilterChange('party', value === 'none' ? null : value)
          }
        >
          <SelectTrigger className="bg-gray-900 border-white text-gray-100 border-2 focus:border-white focus:ring-0">
            <SelectValue
              placeholder={MEMBER_CONSTANTS.FILTERS.PARTY.PLACEHOLDER}
              className="text-gray-300"
            />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
            <SelectItem value="none" className="text-gray-400">
              {MEMBER_CONSTANTS.FILTERS.PARTY.PLACEHOLDER}
            </SelectItem>
            {uniqueParties.map((party) => (
              <SelectItem
                key={party}
                value={party}
                className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
              >
                {party}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.committees || 'none'}
          onValueChange={(value: string) =>
            onFilterChange('committees', value === 'none' ? null : value)
          }
        >
          <SelectTrigger className="bg-gray-900 border-white text-gray-100 border-2 focus:border-white focus:ring-0">
            <SelectValue
              placeholder={MEMBER_CONSTANTS.FILTERS.COMMITTEES.PLACEHOLDER}
              className="text-gray-300"
            />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
            <SelectItem value="none" className="text-gray-400">
              {MEMBER_CONSTANTS.FILTERS.COMMITTEES.PLACEHOLDER}
            </SelectItem>
            {uniqueCommittees.map((committee) => (
              <SelectItem
                key={committee}
                value={committee}
                className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
              >
                {committee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.city || 'none'}
          onValueChange={(value: string) => onFilterChange('city', value === 'none' ? null : value)}
        >
          <SelectTrigger className="bg-gray-900 border-white text-gray-100 border-2 focus:border-white focus:ring-0">
            <SelectValue
              placeholder={MEMBER_CONSTANTS.FILTERS.CITY.PLACEHOLDER}
              className="text-gray-300"
            />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
            <SelectItem value="none" className="text-gray-400">
              {MEMBER_CONSTANTS.FILTERS.CITY.PLACEHOLDER}
            </SelectItem>
            {uniqueCities.map((city) => (
              <SelectItem
                key={city}
                value={city}
                className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
              >
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.district || 'none'}
          onValueChange={(value: string) =>
            onFilterChange('district', value === 'none' ? null : value)
          }
          disabled={!filters.city}
        >
          <SelectTrigger className="bg-gray-900 border-white text-gray-100 border-2 focus:border-white focus:ring-0 disabled:opacity-60">
            <SelectValue
              placeholder={MEMBER_CONSTANTS.FILTERS.DISTRICT.PLACEHOLDER}
              className="text-gray-300"
            />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
            <SelectItem value="none" className="text-gray-400">
              {MEMBER_CONSTANTS.FILTERS.DISTRICT.PLACEHOLDER}
            </SelectItem>
            {uniqueDistricts.map((district) => (
              <SelectItem
                key={district}
                value={district}
                className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
              >
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="bg-gray-800 text-white shadow-none border-0 hover:bg-gray-800 hover:text-white"
          onClick={onReset}
        >
          {MEMBER_CONSTANTS.FILTERS.RESET}
        </Button>
      </div>
    </div>
  );
}
