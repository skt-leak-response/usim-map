import { EMAIL_TEMPLATES } from '@/constants/email';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TemplateKey = keyof typeof EMAIL_TEMPLATES;

export async function POST(request: Request) {
  try {
    const { templateKey, introduction, userRequest } = (await request.json()) as {
      templateKey: TemplateKey;
      introduction: string;
      userRequest: string;
    };

    // 자유 포맷인 경우
    if (templateKey === 'FREE_FORMAT') {
      const systemPrompt = `
당신은 사용자가 국회의원에게 보내는 메일을 대신 작성하는 역할입니다.
사용자가 입력한 정보를 바탕으로 구조화된 메일을 작성하세요.
메일은 반드시 "존경하는 국회의원님께"로 시작해야 합니다.
연락처나 이메일 주소는 기재하지 마세요.

[출력 형식]
첫 줄에 제목만 작성하세요. "제목:" 또는 다른 접두어 없이 제목 내용만 작성하세요.
그 다음 줄부터 본문을 작성하세요.
`;

      const userPrompt = `
A (자기소개): ${introduction}
B (요청사항): ${userRequest}

[작성 지침]
- 제목은 요청사항의 핵심을 간단명료하게 표현해야 합니다.
- 제목은 첫 줄에 작성하되, "제목:" 같은 접두어 없이 제목 내용만 작성하세요.
- 메일은 반드시 "존경하는 국회의원님께"로 시작해야 합니다.
- 국회의원에게 보내는 공식적인 메일의 형식을 지켜주세요.
- 자기소개와 요청사항을 자연스럽게 녹여서 작성해주세요.
- 만약 A가 비어 있을 경우, 발신자는 '시민'으로 가정하여 작성하세요.
- 어림짐작하거나 존재하지 않는 이름을 지어내지 마세요.
- 연락처나 이메일 주소는 기재하지 마세요.
- 마크다운 문법을 사용하여 번호 매기기(1., 2., …)와 빈 줄 단락 구분을 적용해주세요.

위 A, B를 참고하여,
1. 제목 작성 (첫 줄에 제목 내용만)
2. 메일 본문 작성
  • 시작 인사
  • 자기소개
  • 요청사항 설명
  • 마무리 인사
순으로 작성해 주세요.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const email = completion.choices[0].message?.content?.trim() || '';

      // 제목과 본문 분리
      const lines = email.split('\n');
      const rawTitle = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();

      // 제목에서 "제목:" 부분이 있다면 제거
      const cleanTitle = rawTitle.replace(/^제목:\s*/, '');

      return NextResponse.json({
        email: `${cleanTitle}\n\n${content}`,
        title: cleanTitle,
        content: content,
      });
    }

    // 템플릿 기반인 경우
    const { title, description, solution, finish } = EMAIL_TEMPLATES[templateKey];

    const systemPrompt = `
당신은 사용자가 국회의원에게 보내는 메일을 대신 작성하는 역할입니다.
다음은 예시 템플릿입니다.

<Example>

현안 설명:
${description}

해결책 제안:
${solution}

마무리 인사:
${finish}
</Example>

위 예시처럼, 사용자가 입력한 정보를 바탕으로 구조화된 메일을 작성하세요.
메일은 반드시 "존경하는 국회의원님께"로 시작해야 합니다.
연락처나 이메일 주소는 기재하지 마세요.
제목은 메일 본문과 별도로 생성되어야 합니다.

[출력 형식]
제목은 첫 줄에 작성하세요.
`;

    const userPrompt = `
제목 : ${title}
A (자기소개): ${introduction}
B (요청사항): ${userRequest}

[추가 조건]
- 제목은 메일 본문과 별도로 생성되어야 합니다.
- 기존 템플릿의 제목이 있는 경우, 해당 제목을 최대한 유지하면서 필요한 경우에만 최소한으로 수정하세요.
- 제목은 요청사항의 핵심을 간단명료하게 표현해야 합니다.
- 제목은 첫 줄에 작성하세요.
- 메일은 반드시 "존경하는 국회의원님께"로 시작해야 합니다.
- 만약 A가 비어 있을 경우, 발신자는 '시민'으로 가정하여 작성하세요. 
- 자기소개(A)에서 이름이 언급된 경우, 반드시 그 이름을 발신자로 사용하여 "OOO 올림"으로 마무리하세요.
- 만약 B가 비어 있을 경우, 예시 템플릿의 현안 설명과 해결책 제안을 그대로 활용하세요.
- 어림짐작하거나 존재하지 않는 이름을 지어내지 마세요.
- 연락처나 이메일 주소는 기재하지 마세요.

[발신자 처리 예시]
- 자기소개: "저는 20대 여자 박나희입니다" → "박나희 올림"으로 마무리
- 자기소개: "저는 시민입니다" → "시민 올림"으로 마무리

**출력 형식 지시**  
- 마크다운 문법을 사용하여 번호 매기기(1., 2., …)와 빈 줄 단락 구분을 적용해주세요.  

위 A, B와 예시 템플릿을 참고하여,
1. 제목 생성 (첫 줄에 작성)
2. 메일 본문 작성
  • 시작 인사
  • 자기소개
  • 현안 소개 (예시 설명 활용)
  • 사용자 요청 반영
  • 해결책 제안 (예시 솔루션 활용)
  • 마무리 인사 (자기소개의 이름으로 서명)
순으로 작성해 주세요.

처음부터 다시 한 번 천천히 읽으면서 사용자의 요청(B)을 자연스럽게 녹여 하나의 완성된 메일로 작성하는 것이 중요합니다.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const email = completion.choices[0].message?.content?.trim() || '';

    // 제목과 본문 분리
    const lines = email.split('\n');
    const rawTitle = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();

    // "제목:" 부분 제거
    const cleanTitle = rawTitle.replace(/^제목:\s*/, '');

    return NextResponse.json({
      email: `${cleanTitle}\n\n${content}`,
      title: cleanTitle,
      content: content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Email generation failed' }, { status: 500 });
  }
}
