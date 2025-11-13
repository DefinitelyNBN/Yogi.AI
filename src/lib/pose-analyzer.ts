import { Keypoint, CustomPoseConfig } from './pose-constants';

function calculateAngle(p1: Keypoint, p2: Keypoint, p3: Keypoint): number {
  if (!p1 || !p2 || !p3) return 0;

  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}


export function analyzePose(keypoints: Keypoint[], targetAngles: CustomPoseConfig): { feedback: string[], accuracy: number } {
  const feedback: string[] = [];
  let totalScore = 0;
  let rulesApplied = 0;

  const poseScore = keypoints.reduce((acc, kp) => acc + (kp.score ?? 0), 0) / keypoints.length;
  if (!targetAngles || poseScore < 0.3) {
    return { feedback: ["Please position yourself clearly in the frame."], accuracy: 0 };
  }

  for (const joint in targetAngles) {
    rulesApplied++;
    const config = targetAngles[joint];
    const p1 = keypoints[config.p1];
    const p2 = keypoints[config.p2];
    const p3 = keypoints[config.p3];

    if (p1 && p2 && p3 && (p1.score ?? 0) > 0.3 && (p2.score ?? 0) > 0.3 && (p3.score ?? 0) > 0.3) {
      const angle = calculateAngle(p1, p2, p3);
      const deviation = Math.abs(angle - config.target);

      if (deviation > config.tolerance) {
        // Calculate score for incorrect angles. Score decreases the further it is from the tolerance zone.
        // We'll define a max deviation beyond tolerance where the score becomes 0. Let's use 45 degrees.
        const maxDeviation = config.tolerance + 45; 
        const ruleScore = Math.max(0, 1 - (deviation - config.tolerance) / (maxDeviation - config.tolerance));
        totalScore += ruleScore;
        
        if (angle < config.target) {
            if(config.feedback_low) feedback.push(config.feedback_low);
        } else {
            if(config.feedback_high) feedback.push(config.feedback_high);
        }
      } else {
        // Perfect score for this rule
        totalScore += 1;
        feedback.push(config.feedback_good);
      }
    }
  }
  
  if (rulesApplied === 0) {
    return { feedback: ["Hold the pose..."], accuracy: 0 };
  }
  
  const overallAccuracy = (totalScore / rulesApplied) * 100;

  if (feedback.length === 0) {
     return { feedback: ["Analyzing..."], accuracy: overallAccuracy };
  }

  return { feedback, accuracy: overallAccuracy };
}
