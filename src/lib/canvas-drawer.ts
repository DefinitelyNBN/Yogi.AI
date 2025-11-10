import type { Keypoint } from './pose-constants';

// This is an array of connections for the MediaPipe pose model.
// Each subarray represents a connection between two keypoints.
export const POSE_CONNECTIONS = [
    // Torso
    [11, 12], [11, 23], [12, 24], [23, 24],
    // Left Arm
    [11, 13], [13, 15],
    // Right Arm
    [12, 14], [14, 16],
    // Left Leg
    [23, 25], [25, 27],
    // Right Leg
    [24, 26], [26, 28]
];

const SKELETON_COLOR = '#00BFFF'; // Deep sky blue (accent color)
const KEYPOINT_COLOR = '#7B68EE'; // Medium slate blue (primary color)
const LINE_WIDTH = 3;
const KEYPOINT_RADIUS = 4;


function drawSegment([ax, ay]: number[], [bx, by]: number[], color: string, scale: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawSkeleton(keypoints: Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
    POSE_CONNECTIONS.forEach(connection => {
        const [start, end] = connection;
        const kp1 = keypoints[start];
        const kp2 = keypoints[end];
        
        if (kp1 && kp2 && (kp1.score ?? 0) > minConfidence && (kp2.score ?? 0) > minConfidence) {
            drawSegment([kp1.x, kp1.y], [kp2.x, kp2.y], SKELETON_COLOR, 1, ctx);
        }
    });
}

export function drawKeypoints(keypoints: Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
    for (const kp of keypoints) {
        if ((kp.score ?? 0) > minConfidence) {
            const { y, x } = kp;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, KEYPOINT_RADIUS, 0, 2 * Math.PI);
            ctx.fillStyle = KEYPOINT_COLOR;
            ctx.fill();
        }
    }
}
