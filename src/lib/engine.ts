export type Lang = "en" | "hi" | "mr";
export type FlagKey =
  | "guaranteed" | "highReturn" | "urgency" | "payment" | "messaging"
  | "regulatory" | "insider" | "credentials" | "verification" | "hype";

type Rule = { key: FlagKey; weight: number; severity: "red" | "orange"; patterns: RegExp[] };

const RULES: Rule[] = [
  { key: "guaranteed", weight: 22, severity: "red", patterns: [
    /\b(guarantee[ds]?|assured|fixed|risk[- ]?free|no[- ]risk|zero[- ]risk)\b[^.!?\n]{0,30}\b(returns?|profits?|income|income|gains?)\b/i,
    /\bdouble (your|the) (money|investment)\b/i, /\b(100%|completely) safe\b/i,
    /गारंटी|पक्का (रिटर्न|मुनाफा)|हमी|दुप्पट|दोगुना/ ] },
  { key: "highReturn", weight: 14, severity: "red", patterns: [
    /\b([2-9]\d|\d{3,})\s?%[^.!?\n]{0,40}\b(in|within|per|every|a)\s*(\d+\s*)?(days?|weeks?|months?|month)\b/i,
    /\b([3-9]|\d{2,})x (returns?|your money)\b/i ] },
  { key: "urgency", weight: 13, severity: "red", patterns: [
    /\b(limited (seats|time|slots|offer)|act now|hurry|immediately|urgent(ly)?|today only|last chance|only \d+ (seats|slots|spots)|expires? (today|soon)|within 24 hours)\b/i,
    /तुरंत|जल्दी|आज ही|सीमित|लगेच|ताबडतोब/ ] },
  { key: "payment", weight: 20, severity: "red", patterns: [
    /\b(pay|send|transfer|deposit)\b[^.!?\n]{0,25}(₹|rs\.?|inr|\d)/i,
    /\b(activation|registration|joining|processing|membership) (fee|charge|amount)\b/i,
    /\bupfront (payment|fee)\b/i, /\bupi\b[^.!?\n]{0,20}\b(pay|send)\b/i,
    /भुगतान करें|पैसे भेजें|पैसे पाठवा|शुल्क/ ] },
  { key: "messaging", weight: 12, severity: "orange", patterns: [
    /\b(whatsapp|telegram|signal)\b[^.!?\n]{0,40}\b(group|manager|advisor|mentor|channel|contact|join|message)\b/i,
    /\b(join|contact|message)\b[^.!?\n]{0,30}\b(whatsapp|telegram)\b/i ] },
  { key: "regulatory", weight: 16, severity: "orange", patterns: [
    /\b(sebi|rbi|nse|bse|government|govt\.?|nsdl|irdai)[- ]?(approved|certified|registered|authori[sz]ed|backed|guaranteed)\b/i,
    /\b(approved|certified|backed) by (sebi|rbi|the government|govt)\b/i,
    /सेबी (द्वारा )?(मान्यता|अनुमोदित)|सरकार मान्य/ ] },
  { key: "insider", weight: 12, severity: "orange", patterns: [
    /\b(insider (info|information|tips?)|exclusive (opportunity|tips?|access|picks?)|secret (strategy|tips?)|special investment opportunity|operator (call|tips?)|sure[- ]shot)\b/i ] },
  { key: "credentials", weight: 25, severity: "red", patterns: [
    /\b(share|send|provide|tell|enter|give)\b[^.!?\n]{0,30}\b(otp|password|pin|cvv|net ?banking|login|card (number|details))\b/i,
    /ओटीपी (बताएं|भेजें|शेअर करा)/ ] },
  { key: "verification", weight: 14, severity: "red", patterns: [
    /\b(kyc|account)\b[^.!?\n]{0,30}\b(blocked|suspended|expired?|will be (closed|frozen|blocked)|update (now|immediately))\b/i,
    /\bverify your (account|kyc|demat)\b/i ] },
  { key: "hype", weight: 12, severity: "orange", patterns: [
    /\b(multibagger|huge profits?|massive gains|next big (thing|opportunity)|don'?t miss|life[- ]changing|get rich|jackpot|rocket|to the moon)\b/i ] },
];

const NEGATION = /\b(never|don'?t|do not|not|no one will|we will never)\b[^.!?\n]{0,25}$/i;

export type Flag = { key: FlagKey; severity: "red" | "orange"; evidence: string; weight: number };
export type Level = "low" | "moderate" | "high" | "critical";
export type Result = { score: number; level: Level; flags: Flag[]; text: string };

export function levelFor(score: number): Level {
  if (score <= 25) return "low";
  if (score <= 50) return "moderate";
  if (score <= 75) return "high";
  return "critical";
}

export function analyze(text: string): Result {
  const flags: Flag[] = [];
  for (const rule of RULES) {
    for (const p of rule.patterns) {
      const m = p.exec(text);
      if (!m) continue;
      const before = text.slice(Math.max(0, m.index - 40), m.index);
      // Context: safety advice like "never share your OTP" is not a red flag
      if (NEGATION.test(before) || NEGATION.test(m[0].slice(0, 12))) continue;
      flags.push({ key: rule.key, severity: rule.severity, evidence: m[0].trim(), weight: rule.weight });
      break;
    }
  }
  let raw = flags.reduce((s, f) => s + f.weight, 0);
  if (flags.length >= 5) raw += 12;
  else if (flags.length >= 3) raw += 8;
  const score = Math.min(100, Math.round(raw > 60 ? 60 + (raw - 60) * 0.65 : raw));
  flags.sort((a, b) => (a.severity === b.severity ? b.weight - a.weight : a.severity === "red" ? -1 : 1));
  return { score, level: levelFor(score), flags, text };
}

export const DEMOS = {
  high: "Special investment opportunity! Get guaranteed 30% returns in just 60 days. SEBI approved institutional strategy. Limited seats available. Pay ₹10,000 today to activate your account. Contact our investment manager on WhatsApp immediately.",
  moderate: "Exclusive stock tips for smart investors! Join our Telegram group for multibagger picks that could bring huge profits. Thousands of members are already learning from our experts.",
  low: "Learn about the basics of diversification, risk and long-term investing through educational resources.",
};
