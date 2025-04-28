'use client';

import { useState } from 'react';
import { EMAIL_TEMPLATES } from '@/constants/email';
import { Member } from '@/types/members';

interface UseEmailProps {
  selectedMembers: Member[];
}

type TemplateKey = keyof typeof EMAIL_TEMPLATES;

export function useEmail({ selectedMembers }: UseEmailProps) {
  const [template, setTemplate] = useState<TemplateKey>('DEFAULT');
  const [issue, setIssue] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);

  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(selectedMembers.length / BATCH_SIZE);
  const currentMembers = selectedMembers.slice(
    currentBatch * BATCH_SIZE,
    (currentBatch + 1) * BATCH_SIZE,
  );

  const formatEmailContent = () => {
    const templateContent = EMAIL_TEMPLATES[template].content;
    const displayName = senderName || '시민';

    return templateContent
      .replace('{issue}', issue)
      .replace('{content}', content)
      .replace('{senderName}', displayName);
  };

  const getEmailUrl = (provider: string) => {
    const formattedContent = formatEmailContent();
    const subject = `[${issue}] 국회의원님께`;
    const body = formattedContent;

    const emails = currentMembers.map((member) => member.email).join(',');

    switch (provider) {
      case 'gmail':
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
      case 'outlook':
        return `https://outlook.live.com/mail/0/deeplink/compose?to=${emails}&subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
      case 'naver':
        return `https://mail.naver.com/compose?to=${emails}&subject=${encodeURIComponent(
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
