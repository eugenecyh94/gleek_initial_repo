import Consent from "../model/consentModel.js";

export const createClientConsent = async (
  clientId,
  acceptTermsAndConditions,
  session
) => {
  const consentData = {
    client: clientId,
    acceptTermsAndConditions,
    lastUpdated: Date.now(),
  };
  const create = await Consent.create([consentData], session);
  return create[0];
};
