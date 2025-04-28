import type { NextApiRequest, NextApiResponse } from 'next';
import { EMAIL_TEMPLATES } from '@/constants/email';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TemplateKey = keyof typeof EMAIL_TEMPLATES;

interface GenerateEmailRequest {
  templateKey: TemplateKey;
  introduction: string;
  userRequest: string;
}

export async function POST(request: Request) {
  try {
    // request.body(JSON)에서 값 추출
    const { templateKey, introduction, userRequest } = (await request.json()) as {
      templateKey: TemplateKey;
      introduction: string;
      userRequest: string;
    };

    // 선택된 템플릿 정보
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
  `;

    const userPrompt = `
    제목 : ${title}
  A (자기소개): ${introduction}
  B (요청사항): ${userRequest}
  
  [추가 조건]
  - 만약 A가 비어 있을 경우, 발신자는 '시민'으로 가정하여 작성하세요.
  - 만약 B가 비어 있을 경우, 예시 템플릿의 현안 설명과 해결책 제안을 그대로 활용하세요.
  - 어림짐작하거나 존재하지 않는 이름을 지어내지 마세요.
  
  **출력 형식 지시**  
  - 마크다운 문법을 사용하여 번호 매기기(1., 2., …)와 빈 줄 단락 구분을 적용해주세요.  

  위 A, B와 예시 템플릿을 참고하여,
  • 시작 인사
  • 자기소개
  • 현안 소개 (예시 제목 & 설명 활용)
  • 사용자 요청 반영
  • 해결책 제안 (예시 솔루션 활용)
  • 마무리 인사
  순으로 자연스럽게 이어지는 메일 본문을 작성해 주세요.
  (말의 강도는 요구사항에서 스스로 판단하고, 본문에 표기하지 않습니다.)
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
    return NextResponse.json({ email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Email generation failed' }, { status: 500 });
  }
}
