import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdministrativeSidebar from '../../components/AdministrativeSidebar';
import AdministrativeContextHeader from '../../components/AdministrativeContextHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { getPIIConfig, savePIIConfig, resetPIIConfig } from '../../services/piiConfigService';

const PIIConfiguration = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [config, setConfig] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadedConfig = getPIIConfig();
    setConfig(loadedConfig);
  }, []);

  const handleToggle = (key) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    savePIIConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default settings?')) {
      const defaultConfig = resetPIIConfig();
      setConfig(defaultConfig);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (!config) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdministrativeSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`main-content with-admin-sidebar ${
          isSidebarCollapsed ? 'collapsed' : ''
        } with-admin-header transition-all duration-300`}
      >
        <AdministrativeContextHeader />

        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">PII Configuration</h1>
              <p className="text-muted-foreground">
                Configure which types of Personally Identifiable Information should be automatically masked.
              </p>
            </div>
            <Button
              variant="outline"
              iconName="ArrowLeft"
              onClick={() => navigate('/admin-dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icon name="Shield" className="text-primary" />
                Masking Rules
              </h2>
              {isSaved && (
                <span className="text-success text-sm font-medium flex items-center gap-1 animate-fade-in">
                  <Icon name="Check" size={16} />
                  Settings Saved
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="phone"
                      checked={config.enablePhoneMasking}
                      onChange={() => handleToggle('enablePhoneMasking')}
                    />
                    <div>
                      <label htmlFor="phone" className="font-medium text-foreground cursor-pointer">Phone Numbers</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks various phone number formats (e.g., (555) 123-4567)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="email"
                      checked={config.enableEmailMasking}
                      onChange={() => handleToggle('enableEmailMasking')}
                    />
                    <div>
                      <label htmlFor="email" className="font-medium text-foreground cursor-pointer">Email Addresses</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks email addresses while preserving domain (e.g., j***@example.com)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="creditCard"
                      checked={config.enableCreditCardMasking}
                      onChange={() => handleToggle('enableCreditCardMasking')}
                    />
                    <div>
                      <label htmlFor="creditCard" className="font-medium text-foreground cursor-pointer">Credit Cards</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks 16-digit credit card numbers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="ssn"
                      checked={config.enableSSNMasking}
                      onChange={() => handleToggle('enableSSNMasking')}
                    />
                    <div>
                      <label htmlFor="ssn" className="font-medium text-foreground cursor-pointer">Social Security Numbers</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks SSN patterns (e.g., ***-**-1234)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="address"
                      checked={config.enableAddressMasking}
                      onChange={() => handleToggle('enableAddressMasking')}
                    />
                    <div>
                      <label htmlFor="address" className="font-medium text-foreground cursor-pointer">Street Addresses</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks detected physical addresses</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="dob"
                      checked={config.enableDOBMasking}
                      onChange={() => handleToggle('enableDOBMasking')}
                    />
                    <div>
                      <label htmlFor="dob" className="font-medium text-foreground cursor-pointer">Dates of Birth</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks date patterns commonly used for DOB</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                    <Checkbox
                      id="zipCode"
                      checked={config.enableZipCodeMasking}
                      onChange={() => handleToggle('enableZipCodeMasking')}
                    />
                    <div>
                      <label htmlFor="zipCode" className="font-medium text-foreground cursor-pointer">ZIP Codes</label>
                      <p className="text-xs text-muted-foreground mt-1">Masks 5-digit and 9-digit ZIP codes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="default"
                iconName="Save"
                onClick={handleSave}
              >
                Save Configuration
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">About PII Masking</h4>
              <p className="text-sm text-blue-800 mt-1">
                Masking is applied in real-time before data is sent to the AI model or stored in the database.
                Changes to these settings will apply to all future conversations. Existing logs will remain unchanged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PIIConfiguration;
