import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { isMobile } from '@/lib/utils';
import { Member } from '@/types/members';

export function useEmailForm(selectedMembers: Member[]) {
  const [showRecipients, setShowRecipients] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBcc, setCopiedBcc] = useState(false);

  const {
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
  } = useEmail({ selectedMembers });

  const formattedContent = formatEmailContent();
  const needsBatching = selectedMembers.length > 50;
  const currentGroupRecipients = currentMembers;

  // 모바일용 mailto 링크 생성
  const getMailtoUrl = () => {
    const bccEmails = [
      ...currentMembers.map((member) => member.email),
      'response.skt.leak@gmail.com',
    ].join(',');
    return `mailto:?bcc=${encodeURIComponent(bccEmails)}&subject=${encodeURIComponent(
      issue,
    )}&body=${encodeURIComponent(formattedContent)}`;
  };

  // 복사 함수
  const handleCopy = async (text: string, type: 'bcc' | 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'bcc') setCopiedBcc(true);
      else setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCopiedBcc(false);
      }, 1500);
    } catch {}
  };

  return {
    showRecipients,
    setShowRecipients,
    showGuideModal,
    setShowGuideModal,
    copied,
    setCopied,
    copiedBcc,
    setCopiedBcc,
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
    formattedContent,
    needsBatching,
    currentGroupRecipients,
    getMailtoUrl,
    handleCopy,
    isMobile: isMobile(),
  };
}
