'use server';
/**
 * @fileOverview This file imports all the Genkit flows and makes them available to the development server.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-yoga-plans.ts';
import '@/ai/flows/audio-feedback-pose-correction.ts';
import '@/ai/flows/generate-pose-rules.ts';
import '@/ai/flows/generate-pose-image.ts';
