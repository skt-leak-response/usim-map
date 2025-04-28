import { useState, useCallback } from 'react';
import { EMAIL_TEMPLATES, EMAIL_PROVIDERS } from '@/constants/email';

interface EmailTemplate {
  title: string;
  content: string;
}

interface EmailProvider {
  name: string;
  url: string;
}

interface UseEmailProps {
  selectedMembers: Array<{
    name: string;
    email: string;
    city: string;
    district: string;
  }>;
}

export const useEmail = ({ selectedMembers }: UseEmailProps) => {
  const [template, setTemplate] = useState<keyof typeof EMAIL_TEMPLATES>('DEFAULT');
  const [issue, setIssue] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);

  const formatEmailContent = useCallback(() => {
    const templateContent = EMAIL_TEMPLATES[template].content;
    return selectedMembers
      .map((member) =>
        templateContent
          .replace(/{name}/g, member.name)
          .replace(/{city}/g, member.city)
          .replace(/{district}/g, member.district)
          .replace(/{issue}/g, issue)
          .replace(/{content}/g, content)
          .replace(/{senderName}/g, senderName),
      )
      .join('\n\n---\n\n');
  }, [template, selectedMembers, issue, content, senderName]);

  const getEmailUrl = useCallback(
    (provider: keyof typeof EMAIL_PROVIDERS) => {
      const emails = selectedMembers.map((member) => member.email).join(',');
      const formattedContent = formatEmailContent();

      return EMAIL_PROVIDERS[provider].url
        .replace(/{to}/g, emails)
        .replace(/{bcc}/g, '')
        .replace(/{subject}/g, encodeURIComponent(`[시민의견] ${issue}`))
        .replace(/{body}/g, encodeURIComponent(formattedContent));
    },
    [selectedMembers, issue, formatEmailContent],
  );

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

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
    formatEmailContent,
    getEmailUrl,
    copyToClipboard,
  };
};
