export const featureFlags = {
  detailedMiniCart: true,
  checkoutReviewStep: true,
  analytics: true,
  accountUpsell: true,
};

export function isFeatureEnabled(key) {
  return Boolean(featureFlags[key]);
}
