'use client';
import { useMembers } from '@/hooks/useMembers';
import { MEMBER_CONSTANTS } from '@/constants/members';

export default function MemberList() {
  const {
    members,
    filters,
    loading,
    selectedMembers,
    parties,
    committees,
    cities,
    districts,
    handleFilterChange,
    resetFilters,
    toggleMemberSelection,
    toggleSelectAll,
  } = useMembers();

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={MEMBER_CONSTANTS.SEARCH.PLACEHOLDER}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.party}
          onChange={(e) => handleFilterChange('party', e.target.value)}
        >
          <option value="">{MEMBER_CONSTANTS.FILTERS.PARTY.PLACEHOLDER}</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.committees}
          onChange={(e) => handleFilterChange('committees', e.target.value)}
        >
          <option value="">{MEMBER_CONSTANTS.FILTERS.COMMITTEES.PLACEHOLDER}</option>
          {committees.map((committee) => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        >
          <option value="">{MEMBER_CONSTANTS.FILTERS.CITY.PLACEHOLDER}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.district}
          onChange={(e) => handleFilterChange('district', e.target.value)}
          disabled={!filters.city}
        >
          <option value="">{MEMBER_CONSTANTS.FILTERS.DISTRICT.PLACEHOLDER}</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Filter reset button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={resetFilters}
        >
          {MEMBER_CONSTANTS.FILTERS.RESET}
        </button>
      </div>

      {/* Members list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {members.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
              <input
                type="checkbox"
                checked={selectedMembers.size === members.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300">{MEMBER_CONSTANTS.SELECTION.SELECT_ALL}</span>
            </div>
          )}

          {members.map((member) => (
            <div
              key={member.name}
              className={`p-4 rounded-lg border transition-colors ${
                selectedMembers.has(member.name)
                  ? 'bg-blue-900/30 border-blue-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedMembers.has(member.name)}
                  onChange={() => toggleMemberSelection(member.name)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <p className="text-blue-400">{member.party}</p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300">
                      {member.election_count}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-300">
                      <span className="text-gray-400">{MEMBER_CONSTANTS.MEMBER_INFO.DISTRICT}</span>{' '}
                      {member.city} {member.district}
                    </p>
                    <div>
                      <p className="text-gray-400 text-sm">
                        {MEMBER_CONSTANTS.MEMBER_INFO.COMMITTEES}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {member.committees.map((committee: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-md bg-gray-700 text-gray-300"
                          >
                            {committee}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="text-center py-8 text-gray-400">{MEMBER_CONSTANTS.MESSAGES.NO_RESULTS}</div>
      )}
    </div>
  );
}
