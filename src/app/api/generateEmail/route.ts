import type { NextApiRequest, NextApiResponse } from 'next';
import { EMAIL_TEMPLATES } from '@/constants/email';
import OpenAI from 'openai';

type TemplateKey = keyof typeof EMAIL_TEMPLATES;

interface GenerateEmailRequest {
  templateKey: TemplateKey;
  introduction: string;
  userRequest: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { templateKey, introduction, userRequest } = req.body as GenerateEmailRequest;

  const { title, description, solution } = EMAIL_TEMPLATES[templateKey];

  const systemPrompt = `
  당신은 사용자가 국회의원에게 보내는 메일을 대신 작성하는 역할입니다.
  다음은 예시 템플릿입니다.
  
  <Example>
  제목: ${title}
  
  현안 설명:
  ${description}
  
  해결책 제안:
  ${solution}
  </Example>
  
  위 예시처럼, 사용자가 입력한 정보를 바탕으로 구조화된 메일을 작성하세요.
  `;

  const userPrompt = `
  A (자기소개): ${introduction}
  B (요청사항): ${userRequest}
  
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

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const email = completion.choices[0].message?.content?.trim();
    res.status(200).json({ email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email generation failed' });
  }
}
