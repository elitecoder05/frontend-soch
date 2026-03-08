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
    referenceUrl?: string;
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

export const generateScript = async (params: ScriptGenerationParams, signal?: AbortSignal): Promise<ScriptResponse> => {
    try {
        const response = await axios.post<ScriptResponse>(
            `${API_BASE}/api/script-generator/generate`,
            params,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000, // 60s timeout for AI generation
                signal, // Add abort signal support
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        // Handle abort errors
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
            return {
                success: false,
                error: 'Generation cancelled by user.',
            };
        }
        return {
            success: false,
            error: error.message || 'Failed to connect to the server. Please try again.',
        };
    }
};

export const regenerateSection = async (
    section: 'hook' | 'body' | 'cta',
    params: ScriptGenerationParams,
    currentScript: ScriptResult,
    instruction?: string,
    signal?: AbortSignal
): Promise<ScriptResponse> => {
    try {
        const response = await axios.post<ScriptResponse>(
            `${API_BASE}/api/script-generator/regenerate-section`,
            {
                section,
                params,
                currentScript,
                instruction
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000, // 30s timeout for section regeneration
                signal,
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
            return {
                success: false,
                error: 'Regeneration cancelled by user.',
            };
        }
        return {
            success: false,
            error: error.message || 'Failed to regenerate section. Please try again.',
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

// ─── Script History API ─────────────────────────────────────────

import Cookies from 'js-cookie';

const getAuthHeaders = () => {
    const token = Cookies.get('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ScriptHistoryItem {
    _id: string;
    topic: string;
    result?: ScriptResult;
    createdAt: string;
}

export interface ScriptHistoryListResponse {
    success: boolean;
    data?: ScriptHistoryItem[];
    pagination?: { page: number; limit: number; total: number; totalPages: number };
    error?: string;
}

export const saveScriptHistory = async (
    topic: string,
    params: Partial<ScriptGenerationParams>,
    result: ScriptResult
): Promise<{ success: boolean; error?: string }> => {
    try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return { success: false, error: 'Not authenticated' };

        const response = await axios.post(
            `${API_BASE}/api/script-history/save`,
            { topic, params, result },
            { headers: { 'Content-Type': 'application/json', ...headers }, timeout: 10000 }
        );
        return response.data;
    } catch {
        return { success: false, error: 'Failed to save script.' };
    }
};

export const getScriptHistory = async (page = 1): Promise<ScriptHistoryListResponse> => {
    try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return { success: false, error: 'Not authenticated' };

        const response = await axios.get(
            `${API_BASE}/api/script-history?page=${page}&limit=30`,
            { headers, timeout: 10000 }
        );
        return response.data;
    } catch {
        return { success: false, error: 'Failed to fetch history.' };
    }
};

export const getScriptHistoryItem = async (id: string): Promise<{ success: boolean; data?: ScriptHistoryItem; error?: string }> => {
    try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return { success: false, error: 'Not authenticated' };

        const response = await axios.get(
            `${API_BASE}/api/script-history/${id}`,
            { headers, timeout: 10000 }
        );
        return response.data;
    } catch {
        return { success: false, error: 'Failed to fetch script.' };
    }
};

export const deleteScriptHistory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const headers = getAuthHeaders();
        if (!headers.Authorization) return { success: false, error: 'Not authenticated' };

        const response = await axios.delete(
            `${API_BASE}/api/script-history/${id}`,
            { headers, timeout: 10000 }
        );
        return response.data;
    } catch {
        return { success: false, error: 'Failed to delete script.' };
    }
};

export const regenerateSectionApi = async (
    section: 'hook' | 'body' | 'cta',
    params: Partial<ScriptGenerationParams>,
    currentScript: ScriptResult,
    instruction?: string
): Promise<{ success: boolean; data?: Partial<ScriptResult>; error?: string }> => {
    try {
        const response = await axios.post(
            `${API_BASE}/api/script-generator/regenerate-section`,
            { section, params, currentScript, instruction: instruction || '' },
            { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
        );
        return response.data;
    } catch (error: any) {
        return { success: false, error: error.response?.data?.error || 'Failed to regenerate section.' };
    }
};

