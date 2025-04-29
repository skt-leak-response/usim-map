import { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { isMobile, processEmailAddress } from '@/lib/utils';
import { Member } from '@/types/members';

export function useEmailForm(selectedMembers: Member[]) {
  const [showRecipients, setShowRecipients] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBcc, setCopiedBcc] = useState(false);

  const {
    template,
    setTemplate,
    issue,
    setIssue,
    content,
    setContent,
    senderName,
    setSenderName,
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
  } = useEmail({ selectedMembers });

  const needsBatching = selectedMembers.length > 50;
  const currentGroupRecipients = currentMembers;

  // 모바일용 mailto 링크 생성
  const getMailtoUrl = () => {
    const bccEmails = [
      ...currentMembers.map((member) => {
        const processedEmails = processEmailAddress(member.email || '');
        return processedEmails[0]; // Take the first valid email
      }),
      'response.skt.leak@gmail.com',
    ]
      .filter(Boolean)
      .join(',');

    return `mailto:?bcc=${encodeURIComponent(bccEmails)}&subject=${encodeURIComponent(
      issue,
    )}&body=${encodeURIComponent(content)}`;
  };

  // 복사 함수
  const handleCopy = async (text: string, type: 'bcc' | 'content') => {
    try {
      let formattedText = text;
      if (type === 'bcc') {
        // Process each email address
        const emails = text.split(',');
        const processedEmails = emails.flatMap((email) => processEmailAddress(email));
        formattedText = processedEmails.join(', ');
      }
      await navigator.clipboard.writeText(formattedText);
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
    getEmailUrl,
    copyToClipboard,
    needsBatching,
    currentGroupRecipients,
    getMailtoUrl,
    handleCopy,
    isMobile: isMobile(),
    // AI-related props
    template,
    setTemplate,
    intro,
    setIntro,
    userReq,
    setUserReq,
    loadingAI,
    generateEmail,
  };
}
