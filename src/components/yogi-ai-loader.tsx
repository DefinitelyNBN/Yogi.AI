'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { PoseName, CustomPoseConfig } from '@/lib/pose-constants';

export type YogiAiClientProps = {
  selectedPose: PoseName | null;
  poseConfig?: CustomPoseConfig;
  onFeedbackChange: (feedback: string[]) => void;
  onAccuracyChange: (accuracy: number) => void;
  onBreathingUpdate: (rate: number) => void;
  photoDataUri?: string;
};


const YogiAiClient = dynamic(
  () => import('@/components/yogi-ai-client').then((mod) => mod.YogiAiClient),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full">
          <Skeleton className="w-full h-full aspect-video" />
      </div>
    )
  }
);

export function YogiAiLoader(props: YogiAiClientProps) {
  return <YogiAiClient {...props} />;
}
