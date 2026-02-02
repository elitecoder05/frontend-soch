import { AiModel, Category } from "@/types/model";

// This file intentionally contains no hard-coded models or categories.
// The app should fetch data from the backend API. Export empty arrays
// so existing imports won't break during the transition.

export const categories: Category[] = [
  // Existing categories (renamed/updated)
  { id: 'image-to-image', slug: 'image-to-image', name: 'Image to Image Generation', description: 'AI models for image-to-image conversion and transformation', icon: 'Image', modelCount: 0 },
  { id: 'code-ai', slug: 'code-ai', name: 'Code to AI Assistant', description: 'Code generation and AI-powered code assistants', icon: 'Code', modelCount: 0 },
  { id: 'voice-cloning', slug: 'voice-cloning', name: 'Voice to Voice Cloning', description: 'Voice synthesis and cloning models', icon: 'Mic', modelCount: 0 },
  { id: 'writing', slug: 'writing', name: 'Writing & Web', description: 'Writing assistance and web content creation tools', icon: 'BookOpen', modelCount: 0 },
  { id: 'research', slug: 'research', name: 'SEO Research & Science', description: 'Research, analytics, and scientific models', icon: 'Zap', modelCount: 0 },
  { id: 'video-generation', slug: 'video-generation', name: 'Video Generation', description: 'AI models for creating and editing videos', icon: 'Video', modelCount: 0 },
  { id: 'audio-editing', slug: 'audio-editing', name: 'Audio Editing', description: 'Audio processing, editing, and generation tools', icon: 'Mic', modelCount: 0 },
  { id: 'website-design', slug: 'website-design', name: 'Website & Design', description: 'Design, UI/UX, and website creation tools', icon: 'Palette', modelCount: 0 },
  { id: 'education', slug: 'education', name: 'Education & Studies', description: 'Educational and learning-focused AI models', icon: 'BookOpen', modelCount: 0 },
  // New categories
  { id: 'github-projects', slug: 'github-projects', name: 'GitHub Projects', description: 'GitHub integration and project management tools', icon: 'Code', modelCount: 0 },
  { id: 'no-code-low-code', slug: 'no-code-low-code', name: 'No-Code / Low-Code', description: 'No-code and low-code automation platforms', icon: 'Zap', modelCount: 0 },
  { id: 'seo-tools', slug: 'seo-tools', name: 'SEO Tools', description: 'Search engine optimization and ranking tools', icon: 'Zap', modelCount: 0 },
  { id: 'text-to-speech', slug: 'text-to-speech', name: 'Text-to-Speech', description: 'Text to speech synthesis models', icon: 'Mic', modelCount: 0 },
  { id: 'text-to-video', slug: 'text-to-video', name: 'Text-to-Video', description: 'AI models for generating videos from text', icon: 'Video', modelCount: 0 },
  { id: 'copywriting', slug: 'copywriting', name: 'Copywriting', description: 'AI-powered copywriting and marketing content creation', icon: 'BookOpen', modelCount: 0 },
  { id: 'ai-detection', slug: 'ai-detection', name: 'AI Detection', description: 'Tools for detecting AI-generated content', icon: 'Zap', modelCount: 0 },
  // Additional core categories
  { id: 'chatbots', slug: 'chatbots', name: 'Chatbots', description: 'Conversational AI and chat assistants', icon: 'MessageSquare', modelCount: 0 },
  { id: 'productivity', slug: 'productivity', name: 'Productivity', description: 'Tools to boost productivity', icon: 'Zap', modelCount: 0 },
  { id: 'agents', slug: 'agents', name: 'AI Agents', description: 'Agent-based automation models', icon: 'Bot', modelCount: 0 },
  { id: 'data-analysis', slug: 'data-analysis', name: 'Data Analysis', description: 'Models for data analytics', icon: 'Zap', modelCount: 0 },
  { id: 'automation', slug: 'automation', name: 'Automation', description: 'Automation and workflow models', icon: 'Zap', modelCount: 0 }
];

export const aiModels: AiModel[] = [];

// Small fetch helper (optional). Implement API calls in `src/api` instead.
export async function fetchModelsFromApi(): Promise<AiModel[]> {
  return [];
}
