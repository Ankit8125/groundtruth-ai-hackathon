
const STORAGE_KEY = 'groundtruth_ai_pii_config_v1';

const DEFAULT_CONFIG = {
  enablePhoneMasking: true,
  enableEmailMasking: true,
  enableCreditCardMasking: true,
  enableSSNMasking: true,
  enableAddressMasking: true,
  enableDOBMasking: true,
  enableZipCodeMasking: true
};

export const getPIIConfig = () => {
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (storedConfig) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(storedConfig) };
    }
  } catch (error) {
    console.error('Failed to load PII config:', error);
  }
  return DEFAULT_CONFIG;
};

export const savePIIConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save PII config:', error);
  }
};

export const resetPIIConfig = () => {
  savePIIConfig(DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
};
