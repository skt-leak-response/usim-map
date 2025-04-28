import { Member } from '@/types/members';
import membersData from '@/data/members.json';

export const MEMBERS: Member[] = membersData;

export const MEMBER_CONSTANTS = {
  SEARCH: {
    PLACEHOLDER: '이름으로 검색',
  },
  FILTERS: {
    PARTY: {
      LABEL: '정당 선택',
      PLACEHOLDER: '정당 선택',
    },
    COMMITTEES: {
      LABEL: '위원회 선택',
      PLACEHOLDER: '위원회 선택',
    },
    CITY: {
      LABEL: '시/도 선택',
      PLACEHOLDER: '시/도 선택',
    },
    DISTRICT: {
      LABEL: '지역구 선택',
      PLACEHOLDER: '지역구 선택',
    },
    RESET: '필터 초기화',
  },
  SELECTION: {
    SELECT_ALL: '전체 선택',
  },
  MEMBER_INFO: {
    DISTRICT: '지역구:',
    COMMITTEES: '소속위원회:',
  },
  MESSAGES: {
    NO_RESULTS: '검색 결과가 없습니다.',
  },
  MAIN_PAGE: {
    TITLE: '국회의원 선택',
    DESCRIPTION: '이메일을 보낼 국회의원을 선택해주세요. (최대 300명)',
  },
} as const;
