// featureFlagService.js
// This service manages feature flags for the GMS application

const DEFAULT_FLAGS = {
  officer_table_view: true,
  grievance_self_assignment: false,
  investigate_workflow: false,
};

class FeatureFlagService {
  constructor() {
    this.initializeFlags();
  }

  initializeFlags() {
    const stored = localStorage.getItem("featureFlags");
    if (!stored) {
      localStorage.setItem("featureFlags", JSON.stringify(DEFAULT_FLAGS));
    }
  }

  getAllFlags() {
    const stored = localStorage.getItem("featureFlags");
    return stored ? JSON.parse(stored) : DEFAULT_FLAGS;
  }

  isEnabled(flagName) {
    const flags = this.getAllFlags();
    return flags[flagName] || false;
  }

  setFlag(flagName, enabled) {
    const flags = this.getAllFlags();
    flags[flagName] = enabled;
    localStorage.setItem("featureFlags", JSON.stringify(flags));

    // Trigger custom event so components can listen for changes
    window.dispatchEvent(
      new CustomEvent("featureFlagsChanged", {
        detail: flags,
      }),
    );
  }

  toggleFlag(flagName) {
    const flags = this.getAllFlags();
    flags[flagName] = !flags[flagName];
    localStorage.setItem("featureFlags", JSON.stringify(flags));

    window.dispatchEvent(
      new CustomEvent("featureFlagsChanged", {
        detail: flags,
      }),
    );
  }

  resetToDefaults() {
    localStorage.setItem("featureFlags", JSON.stringify(DEFAULT_FLAGS));
    window.dispatchEvent(
      new CustomEvent("featureFlagsChanged", {
        detail: DEFAULT_FLAGS,
      }),
    );
  }
}

export default new FeatureFlagService();
