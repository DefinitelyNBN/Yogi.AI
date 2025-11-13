'use server';
import { generateYogaPlan, GenerateYogaPlanInput } from '@/ai/flows/personalized-yoga-plans';
import { audioFeedbackForPoseCorrection, AudioFeedbackForPoseCorrectionInput } from '@/ai/flows/audio-feedback-pose-correction';
import { generatePoseRules, GeneratePoseRulesInput, GeneratePoseRulesOutput } from '@/ai/flows/generate-pose-rules';

export async function getYogaPlan(input: GenerateYogaPlanInput) {
    try {
        const result = await generateYogaPlan(input);
        return { success: true, plan: result.plan };
    } catch (error) {
        console.error('Error generating yoga plan:', error);
        return { success: false, error: 'Failed to generate a new plan. Please try again.' };
    }
}

export async function getAudioFeedback(input: AudioFeedbackForPoseCorrectionInput) {
     try {
        const result = await audioFeedbackForPoseCorrection(input);
        return { success: true, audioDataUri: result.audioDataUri };
    } catch (error) {
        console.error('Error generating audio feedback:', error);
        return { success: false, error: 'Failed to generate audio feedback.' };
    }
}

export async function getAIPoseRules(input: GeneratePoseRulesInput): Promise<{ success: boolean, rules?: GeneratePoseRulesOutput['rules'], error?: string }> {
    try {
        const result = await generatePoseRules(input);
        return { success: true, rules: result.rules };
    } catch (error) {
        console.error('Error generating AI pose rules:', error);
        return { success: false, error: 'Failed to generate AI rules. Please try again.' };
    }
}
