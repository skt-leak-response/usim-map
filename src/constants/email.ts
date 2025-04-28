export const EMAIL_TEMPLATES = {
  DEFAULT: {
    title: '기본 템플릿',
    content: `안녕하세요, {name} 의원님.

저는 {city} {district}에 거주하는 시민입니다.
현재 우리 지역의 {issue} 문제에 대해 우려가 있어 이렇게 메일을 보내게 되었습니다.

{content}

바쁘신 와중에도 제 의견을 들어주셔서 감사합니다.
좋은 하루 되세요.

{senderName} 드림`,
  },
  ENVIRONMENT: {
    title: '환경 문제',
    content: `안녕하세요, {name} 의원님.

저는 {city} {district}에 거주하는 시민입니다.
현재 우리 지역의 환경 문제에 대해 우려가 있어 이렇게 메일을 보내게 되었습니다.

최근 {issue} 문제가 심각해지고 있습니다.
이에 대한 정책적 대응이 시급하다고 생각합니다.

{content}

바쁘신 와중에도 제 의견을 들어주셔서 감사합니다.
좋은 하루 되세요.

{senderName} 드림`,
  },
  EDUCATION: {
    title: '교육 문제',
    content: `안녕하세요, {name} 의원님.

저는 {city} {district}에 거주하는 시민입니다.
현재 우리 지역의 교육 문제에 대해 우려가 있어 이렇게 메일을 보내게 되었습니다.

{issue} 문제가 학생들의 학습권을 침해하고 있습니다.
이에 대한 정책적 대응이 시급하다고 생각합니다.

{content}

바쁘신 와중에도 제 의견을 들어주셔서 감사합니다.
좋은 하루 되세요.

{senderName} 드림`,
  },
} as const;

export const EMAIL_PROVIDERS = {
  GMAIL: {
    name: 'Gmail',
    url: 'https://mail.google.com/mail/?view=cm&fs=1&to={to}&bcc={bcc}&su={subject}&body={body}',
  },
  NAVER: {
    name: 'Naver Mail',
    url: 'https://mail.naver.com/write?to={to}&bcc={bcc}&subject={subject}&body={body}',
  },
} as const;
