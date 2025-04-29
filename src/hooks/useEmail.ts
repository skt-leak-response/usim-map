'use client';

import { useState, useEffect } from 'react';
import { EMAIL_TEMPLATES } from '@/constants/email';
import { Member } from '@/types/members';

interface UseEmailProps {
  selectedMembers: Member[];
}

export type TemplateKey = keyof typeof EMAIL_TEMPLATES;

export function useEmail({ selectedMembers }: UseEmailProps) {
  const [template, setTemplate] = useState<TemplateKey>('SKT_USIM');
  const [issue, setIssue] = useState<string>(EMAIL_TEMPLATES.SKT_USIM.title);
  const [content, setContent] = useState<string>('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);

  const [intro, setIntro] = useState('');
  const [userReq, setUserReq] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // 템플릿이 변경될 때 issue와 content를 업데이트
  useEffect(() => {
    setIssue(EMAIL_TEMPLATES[template].title);
    const baseContent = `${EMAIL_TEMPLATES[template].description}

${EMAIL_TEMPLATES[template].solution}

${EMAIL_TEMPLATES[template].finish}`;
    setContent(baseContent);
  }, [template]);

  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(selectedMembers.length / BATCH_SIZE);
  const currentMembers = selectedMembers.slice(
    currentBatch * BATCH_SIZE,
    (currentBatch + 1) * BATCH_SIZE,
  );

  const generateEmail = async () => {
    try {
      setLoadingAI(true);
      const response = await fetch('/api/generateEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateKey: template,
          introduction: intro,
          userRequest: userReq,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      const email = data.email;

      // 제목과 본문 분리
      const lines = email.split('\n');
      const title = lines[0].trim().replace('제목 :', '').trim();
      const content = lines.slice(1).join('\n').trim();

      setIssue(title);
      setContent(content);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const getEmailUrl = (provider: string) => {
    const subject = `[${issue}]`;
    const body = content;

    // 모든 이메일을 BCC로 설정하고 이메일 주소 처리
    const bccEmails = [
      ...currentMembers.map((member) => {
        // 이메일 주소에서 괄호 내용 제거 및 슬래시로 구분된 주소 처리
        const cleanEmail = member.email
          ?.replace(/\s*\([^)]*\)/g, '') // 괄호와 그 안의 내용 제거
          ?.split('/') // 슬래시로 구분된 주소 분리
          ?.map((e) => e.trim()) // 각 주소 앞뒤 공백 제거
          ?.filter((e) => e.length > 0)[0]; // 빈 문자열 제거하고 첫 번째 주소만 사용
        return cleanEmail;
      }),
      'response.skt.leak@gmail.com',
    ].filter(Boolean); // null이나 undefined 제거

    switch (provider) {
      case 'gmail':
        // Gmail용 URL 생성 - 이메일 주소를 콤마로 구분
        const encodedBcc = encodeURIComponent(bccEmails.join(','));
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        return `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&bcc=${encodedBcc}&su=${encodedSubject}&body=${encodedBody}`;
      case 'outlook':
        return `https://outlook.live.com/mail/0/deeplink/compose?bcc=${bccEmails.join(
          ',',
        )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      case 'naver':
        return `https://mail.naver.com/compose?bcc=${bccEmails.join(
          ',',
        )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      default:
        return '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return {
    template,
    setTemplate,
    issue,
    setIssue,
    content,
    setContent,

    intro,
    setIntro,
    userReq,
    setUserReq,
    loadingAI,
    generateEmail,
    showCopyToast,
    currentBatch,
    setCurrentBatch,
    totalBatches,
    currentMembers,
    getEmailUrl,
    copyToClipboard,
  };
}
