'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/types/members';
import { MEMBER_CONSTANTS } from '@/constants/members';
import { encodeIds } from '@/utils/encoding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  }, [members, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      return isSelected ? prev.filter((m) => m.id !== member.id) : [...prev, member];
    });
  };

  useEffect(() => {
    onSelectionChange(selectedMembers);
  }, [selectedMembers, onSelectionChange]);

  const handleNext = () => {
    if (selectedMembers.length === 0) return;
    const ids = selectedMembers.map((member) => member.id);
    const encodedIds = encodeIds(ids);
    router.push(`/email?ids=${encodedIds}`);
  };

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
          handleFilterChange('search', e.target.value)
        }
        className="bg-gray-900 border-white text-gray-100 placeholder:text-gray-500 border-2 focus:border-white focus:ring-0"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          value={filters.party || 'none'}
          onValueChange={(value: string) =>
            handleFilterChange('party', value === 'none' ? null : value)
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
            {uniqueParties.length > 0 ? (
              uniqueParties.map((party) => (
                <SelectItem
                  key={party}
                  value={party}
                  className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
                >
                  {party}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled className="text-gray-500">
                로딩 중...
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.committees || 'none'}
          onValueChange={(value: string) =>
            handleFilterChange('committees', value === 'none' ? null : value)
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
            {uniqueCommittees.length > 0 ? (
              uniqueCommittees.map((committee) => (
                <SelectItem
                  key={committee}
                  value={committee}
                  className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
                >
                  {committee}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled className="text-gray-500">
                로딩 중...
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.city || 'none'}
          onValueChange={(value: string) =>
            handleFilterChange('city', value === 'none' ? null : value)
          }
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
            {uniqueCities.length > 0 ? (
              uniqueCities.map((city) => (
                <SelectItem
                  key={city}
                  value={city}
                  className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
                >
                  {city}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled className="text-gray-500">
                로딩 중...
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.district || 'none'}
          onValueChange={(value: string) =>
            handleFilterChange('district', value === 'none' ? null : value)
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
            {uniqueDistricts.length > 0 ? (
              uniqueDistricts.map((district) => (
                <SelectItem
                  key={district}
                  value={district}
                  className="text-gray-100 hover:bg-gray-800 focus:text-gray-900 hover:text-gray-900"
                >
                  {district}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled className="text-gray-500">
                로딩 중...
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-gray-800 text-white shadow-none border-0 hover:bg-gray-800 hover:text-white"
          onClick={() => {
            setFilters({
              party: null,
              committees: null,
              city: null,
              district: null,
              search: '',
            });
            setSelectedMembers([]);
          }}
        >
          {MEMBER_CONSTANTS.FILTERS.RESET}
        </Button>
      </div>

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
        <div className="text-center text-gray-400">Loading...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center text-gray-400">No members found</div>
      ) : (
        <div className="space-y-2">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedMembers.length === filteredMembers.length}
                  onCheckedChange={() => {
                    if (selectedMembers.length === filteredMembers.length) {
                      setSelectedMembers([]);
                    } else {
                      setSelectedMembers(filteredMembers);
                    }
                  }}
                  className="border-2 border-white bg-transparent text-white data-[state=checked]:text-white data-[state=checked]:border-white focus:ring-0"
                />
                <Label className="text-gray-200">전체 선택</Label>
              </div>
            </CardContent>
          </Card>
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className={`$ {
                selectedMembers.some((m) => m.id === member.id)
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedMembers.some((m) => m.id === member.id)}
                    onCheckedChange={() => handleMemberClick(member)}
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
          ))}
        </div>
      )}
    </div>
  );
}
