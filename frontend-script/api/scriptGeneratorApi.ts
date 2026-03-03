import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1000';

export interface ScriptGenerationParams {
    topic: string;
    duration: '30s' | '1min' | 'custom';
    customDuration?: number;
    language: 'English' | 'Hindi' | 'Hinglish';
    audience: 'Students' | 'Entrepreneurs' | 'Creators' | 'custom';
    customAudience?: string;
    emotionalIntensity: number;
    customIntensity?: string;
    tone: string;
    ctaEnabled: boolean;
    ctaType?: string;
    customCta?: string;
}

export interface ScriptResult {
    hook: {
        type: string;
        text: string;
    };
    body: {
        framework: string;
        text: string;
    };
    cta: {
        included: boolean;
        text: string;
    };
    metadata: {
        hookType: string;
        frameworkUsed: string;
        wordCount: number;
        estimatedDuration: string;
        targetAudience: string;
        language: string;
        tone: string;
        emotionalIntensity: number;
    };
    qualityScores: {
        hookStrength: number;
        retentionPotential: number;
        emotionalIntensityMatch: number;
        ctaAlignment: number;
    };
}

export interface ScriptResponse {
    success: boolean;
    data?: ScriptResult;
    error?: string;
}

export const generateScript = async (params: ScriptGenerationParams): Promise<ScriptResponse> => {
    try {
        const response = await axios.post<ScriptResponse>(
            `${API_BASE}/api/script-generator/generate`,
            params,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000, // 60s timeout for AI generation
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            error: error.message || 'Failed to connect to the server. Please try again.',
        };
    }
};

export const checkScriptGeneratorHealth = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_BASE}/api/script-generator/health`, { timeout: 10000 });
        return response.data?.geminiConfigured === true;
    } catch {
        return false;
    }
};
