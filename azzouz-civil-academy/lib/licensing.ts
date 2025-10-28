export type RightsStatus = "own" | "licensed" | "public_domain" | "unclear";

export type DistributionMode = "host_file" | "link_out";

export function getRightsLabel(status: RightsStatus, locale: string): string {
  const labels: Record<RightsStatus, Record<string, string>> = {
    own: { fr: "Propri�t� AZ-CIVIL-ACADEMY", en: "Owned rights", ar: "???? ???? ???????????" },
    licensed: { fr: "Sous licence", en: "Licensed", ar: "?????" },
    public_domain: { fr: "Domaine public", en: "Public domain", ar: "????? ????" },
    unclear: { fr: "Droits � confirmer", en: "Rights to confirm", ar: "???? ??? ?????" }
  };

  const lang = labels[status];
  return lang?.[locale] ?? labels[status].fr;
}

export function canHostFile(status: RightsStatus): boolean {
  return status === "own" || status === "licensed" || status === "public_domain";
}

export function inferDistributionMode(status: RightsStatus): DistributionMode {
  return canHostFile(status) ? "host_file" : "link_out";
}
