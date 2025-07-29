'use client';

import { Button } from '@/components/ui/button';

export default function ActionButtons({ onSelect }: {
  onSelect: (mode: 'manual' | 'ai') => void;
}) {
  return (
    <div className="mt-6 flex gap-4">
      <Button variant="outline" onClick={() => onSelect('manual')}>
        Add Topics Manually
      </Button>
      <Button onClick={() => onSelect('ai')}>
        Generate with AI
      </Button>
    </div>
  );
}
