import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Member } from '@/types/members';
import React from 'react';

interface EmailRecipientsToggleProps {
  showRecipients: boolean;
  setShowRecipients: (v: boolean) => void;
  currentGroupRecipients: Member[];
  needsBatching: boolean;
  currentBatch: number;
  totalBatches: number;
}

export function EmailRecipientsToggle({
  showRecipients,
  setShowRecipients,
  currentGroupRecipients,
  needsBatching,
  currentBatch,
  totalBatches,
}: EmailRecipientsToggleProps) {
  return (
    <div>
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setShowRecipients(!showRecipients)}
      >
        <span>
          받는 사람 ({currentGroupRecipients.length}명
          {needsBatching && ` - ${currentBatch + 1}/${totalBatches}번째 그룹`})
        </span>
        {showRecipients ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
      {showRecipients && (
        <Card className="mt-2">
          <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto">
            {currentGroupRecipients.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center text-gray-900 hover:text-black"
              >
                <span>
                  {member.name} ({member.city} {member.district}) (BCC)
                </span>
                <span className="text-sm text-gray-700">{member.email}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-gray-900 hover:text-black">
              <span className="text-gray-900">response.skt.leak@gmail.com (BCC)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
