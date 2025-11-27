/** Checked
 * @fileoverview This component represents the "Pose Analysis" pane. It's the main
 * control center for the user to interact with the pose correction feature.
 *
 * It includes:
 * - An image and description of the selected pose.
 * - A real-time accuracy progress bar.
 * - A list of feedback messages from the AI.
 */
'use client';
import React from 'react';
import Image from 'next/image';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PoseName } from '@/lib/pose-constants';
import { ImagePlaceholder } from '@/lib/placeholder-images';
import {
  CheckCircle,
  Info,
  Volume2,
} from 'lucide-react';

interface PoseAnalysisPaneProps {
  // Props for displaying analysis results
  selectedPose: PoseName;
  selectedPoseImage: ImagePlaceholder | null;
  feedbackList: string[];
  poseAccuracy: number;
}

/**
 * Renders the top-right pane of the dashboard, containing all pose analysis controls and feedback.
 */
export function PoseAnalysisPane({
  selectedPose,
  selectedPoseImage,
  feedbackList,
  poseAccuracy,
}: PoseAnalysisPaneProps) {
  return (
    <div className="h-full">
      <CardHeader>
        <CardTitle>Pose Analysis</CardTitle>
        <CardDescription>Live feedback on your form and accuracy.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* REFERENCE IMAGE for the selected pose */}
        {selectedPoseImage && selectedPose && (
          <div className="mt-4">
            <Image
              src={selectedPoseImage.imageUrl}
              alt={`Example of ${selectedPose} pose`}
              width={600}
              height={400}
              className="rounded-md object-cover aspect-video"
              data-ai-hint={selectedPoseImage.imageHint}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {selectedPoseImage.description}
            </p>
          </div>
        )}

        {/* ACCURACY BAR */}
        {selectedPose && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Accuracy
              </span>
              <Progress value={poseAccuracy} className="w-full" />
              <span className="text-sm font-bold w-12 text-right">
                {poseAccuracy.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* FEEDBACK LIST */}
        <div
          id="feedback-box"
          className="mt-4 space-y-2 text-sm min-h-[100px]"
        >
          {selectedPose ? (
            feedbackList.length > 0 ? (
              feedbackList.map((item, index) => {
                const isGood =
                  item.includes('good') || item.includes('perfect');
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      isGood
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-amber-100 dark:bg-amber-900/50'
                    }`}
                  >
                    {isGood ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Info className="h-4 w-4 text-amber-600" />
                    )}
                    <span
                      className={
                        isGood
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-amber-800 dark:text-amber-300'
                      }
                    >
                      {item}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-muted-foreground pt-4 text-center">
                Analyzing...
              </div>
            )
          ) : (
            <div className="text-muted-foreground pt-4 text-center">
              Select a pose for feedback.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-4 w-4" />
          <span>Audio feedback is enabled for corrections.</span>
        </div>
      </CardFooter>
    </div>
  );
}
