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
  const [content, setContent] = useState<string>(
    EMAIL_TEMPLATES.SKT_USIM.content.replace('{senderName}', '시민'),
  );
  const [senderName, setSenderName] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);

  // 템플릿이 변경될 때 issue와 content를 업데이트
  useEffect(() => {
    setIssue(EMAIL_TEMPLATES[template].title);
    setContent(EMAIL_TEMPLATES[template].content.replace('{senderName}', senderName || '시민'));
  }, [template, senderName]);

  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(selectedMembers.length / BATCH_SIZE);
  const currentMembers = selectedMembers.slice(
    currentBatch * BATCH_SIZE,
    (currentBatch + 1) * BATCH_SIZE,
  );

  const formatEmailContent = () => {
    const displayName = senderName || '시민';
    return content.replace('{senderName}', displayName);
  };

  const getEmailUrl = (provider: string) => {
    const formattedContent = formatEmailContent();
    const subject = `[${issue}]`;
    const body = formattedContent;

    // 모든 이메일을 BCC로 설정
    const bccEmails = [
      ...currentMembers.map((member) => member.email),
      'response.skt.leak@gmail.com',
    ].join(',');

    switch (provider) {
      case 'gmail':
        return `https://mail.google.com/mail/?view=cm&fs=1&bcc=${bccEmails}&su=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
      case 'outlook':
        return `https://outlook.live.com/mail/0/deeplink/compose?bcc=${bccEmails}&subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
      case 'naver':
        return `https://mail.naver.com/compose?bcc=${bccEmails}&subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
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
    senderName,
    setSenderName,
    showCopyToast,
    currentBatch,
    setCurrentBatch,
    totalBatches,
    currentMembers,
    formatEmailContent,
    getEmailUrl,
    copyToClipboard,
  };
}
