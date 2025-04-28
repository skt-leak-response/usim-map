export const EMAIL_TEMPLATES = {
  DEFAULT: {
    title: '기본 템플릿',
    content: `안녕하세요, 국회의원님.

{content}

{issue}에 대한 국회의원님의 관심과 적극적인 대응을 부탁드립니다.

감사합니다.
{senderName} 올림`,
  },
  ENVIRONMENT: {
    title: '환경 관련',
    content: `안녕하세요, 국회의원님.

{content}

환경 보호와 지속가능한 발전을 위해 {issue}에 대한 국회의원님의 관심과 적극적인 대응을 부탁드립니다.

감사합니다.
{senderName} 올림`,
  },
  EDUCATION: {
    title: '교육 관련',
    content: `안녕하세요, 국회의원님.

{content}

우리 아이들의 미래를 위해 {issue}에 대한 국회의원님의 관심과 적극적인 대응을 부탁드립니다.

감사합니다.
{senderName} 올림`,
  },
} as const;

export const EMAIL_PROVIDERS = {
  gmail: {
    name: 'Gmail',
  },
  outlook: {
    name: 'Outlook',
  },
  naver: {
    name: '네이버',
  },
} as const;
