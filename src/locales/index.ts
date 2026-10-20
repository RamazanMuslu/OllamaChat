import { en } from './en';
import { tr } from './tr';
import { SupportedLanguage, TranslationSchema } from './types';

export * from './types';
export { en, tr };

export const locales: Record<SupportedLanguage, TranslationSchema> = {
    en,
    tr,
};

export const defaultLanguage: SupportedLanguage = 'en';

/**
 * Resolves the effective language based on user setting ('auto' | 'en' | 'tr')
 * and VS Code environment language (e.g. 'tr', 'en', 'de', etc.)
 */
export function resolveLanguage(settingLang?: string, vscodeLang?: string): SupportedLanguage {
    if (settingLang && settingLang !== 'auto') {
        if (settingLang in locales) {
            return settingLang as SupportedLanguage;
        }
    }

    if (vscodeLang) {
        const primary = vscodeLang.split('-')[0].toLowerCase();
        if (primary in locales) {
            return primary as SupportedLanguage;
        }
    }

    return defaultLanguage;
}

/**
 * Returns translation dictionary for given language with fallback to defaultLanguage ('en')
 */
export function getTranslation(lang?: string): TranslationSchema {
    if (lang && lang in locales) {
        return locales[lang as SupportedLanguage];
    }
    return locales[defaultLanguage];
}
