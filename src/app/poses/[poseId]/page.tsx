/**
 * @fileoverview This file defines the dynamic page for displaying a single yoga pose.
 * It uses Next.js dynamic routing to handle pages like `/poses/Tree`, `/poses/Warrior_II`, etc.
 *
 * The core responsibilities of this file are:
 * 1.  **Dynamic Route Handling**: It receives the `poseId` from the URL parameters.
 * 2.  **Renders the Client Component**: It renders the `PosePageClient`, which contains
 *     the actual layout and logic for the pose page.
 * 3.  **Passes Pose ID**: It passes the `poseId` down to the client component so it
 *     knows which pose's data to load and display.
 */

import { PosePageClient } from '@/features/poses/components/PosePageClient';

// This is the Next.js page component for the dynamic route.
export default function PosePage({ params }: { params: { poseId: string } }) {
  // It simply renders the main client component for the pose page,
  // passing the poseId from the URL as a prop.
  return <PosePageClient poseId={params.poseId} />;
}
