/**
 * @fileoverview This is the main client component for an individual pose page.
 * It orchestrates the layout and state for displaying a single yoga pose, including
 * the camera feed, pose analysis, and other related tools.
 *
 * The core responsibilities of this file are:
 * 1.  **Layout Management**: It defines the two-pane layout for the pose page.
 *     - The left pane contains the `CameraPane`.
 *     - The right pane contains a tabbed interface for `PoseAnalysisPane`, `PoseListPane`,
 *       and `PlanPane`.
 * 2.  **State Management**: It uses the `useYogaDashboard` hook to access all application
 *     state and logic (e.g., pose data, feedback, plan generation).
 * 3.  **Data Fetching**: It uses the `poseId` prop (from the URL) to look up the
 *     correct pose configuration and image from the centralized state.
 * 4.  **Component Integration**: It renders all the necessary child components,
 *     passing the required data and handlers to them.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useYogaDashboard } from '@/features/dashboard/hooks/useYogaDashboard';
import { CameraPane } from '@/features/dashboard/components/layout/CameraPane';
import { PoseAnalysisPane } from '@/features/dashboard/components/layout/PoseAnalysisPane';
import { PlanPane } from '@/features/dashboard/components/layout/PlanPane';
import { Icons } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PoseListPane } from '@/features/poses/components/PoseListPane';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PosePageClientProps {
  poseId: string;
}

export function PosePageClient({ poseId }: PosePageClientProps) {
  const yogaApp = useYogaDashboard();

  // Find the specific config and image for the current poseId.
  const poseConfig = yogaApp.allPoseConfigs[poseId];
  const selectedPoseImage = yogaApp.allPoseImages[poseId] || null;

  // If the poseId from the URL is invalid, show a "not found" message.
  if (!poseConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Pose Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The pose you are looking for does not exist.
        </p>
        <Link href="/" passHref>
          <Button>
            <Home className="mr-2 h-4 w-4" /> Go Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-4 flex items-center">
            <Icons.yoga className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold text-lg">Yogi.AI</span>
          </Link>
          <p className="text-sm text-muted-foreground hidden md:block">
            Now practicing: <span className="font-semibold text-foreground">{yogaApp.allPoses[poseId].name}</span>
          </p>
          <Link href="/" className="ml-auto">
             <Button variant="outline">
                <Home className="mr-2 h-4 w-4"/>
                Pose Directory
             </Button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA: A 2-column grid */}
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          {/* Left Pane: Camera Feed */}
          <div className="h-full">
            <CameraPane
              selectedPose={poseId}
              poseConfig={poseConfig}
              onFeedbackChange={yogaApp.setFeedbackList}
              onAccuracyChange={yogaApp.setPoseAccuracy}
              photoDataUri={selectedPoseImage?.imageUrl}
            />
          </div>

          {/* Right Pane: Tabbed Interface for other features */}
          <div className="h-full">
            <Card className="h-full">
              <Tabs defaultValue="analysis" className="h-full flex flex-col">
                <TabsList className="w-full">
                  <TabsTrigger value="analysis" className="flex-1">Pose Analysis</TabsTrigger>
                  <TabsTrigger value="poses" className="flex-1">All Poses</TabsTrigger>
                  <TabsTrigger value="plan" className="flex-1">Yoga Plan</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="analysis">
                        <PoseAnalysisPane
                        selectedPose={poseId}
                        selectedPoseImage={selectedPoseImage}
                        feedbackList={yogaApp.feedbackList}
                        poseAccuracy={yogaApp.poseAccuracy}
                        />
                    </TabsContent>

                    <TabsContent value="poses">
                        <PoseListPane 
                            allPoses={yogaApp.allPoses} 
                            allPoseImages={yogaApp.allPoseImages}
                            currentPoseId={poseId}
                        />
                    </TabsContent>

                    <TabsContent value="plan">
                        <PlanPane
                        goal={yogaApp.goal}
                        setGoal={yogaApp.setGoal}
                        isGeneratingPlan={yogaApp.isGeneratingPlan}
                        handleGeneratePlan={yogaApp.handleGeneratePlan}
                        generatedPlan={yogaApp.generatedPlan}
                        />
                    </TabsContent>
                </div>

              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
