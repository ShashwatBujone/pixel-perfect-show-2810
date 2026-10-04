import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FlagKey, Lang, Level } from "./engine";

type FlagText = { title: string; explain: string; simple: string };
type Dict = {
  levels: Record<Level, string>;
  flags: Record<FlagKey, FlagText>;
  ui: Record<string, string>;
  steps: string[];
  nextSteps: string[];
};

const en: Dict = {
  levels: { low: "Low risk", moderate: "Moderate risk", high: "High risk", critical: "Critical risk" },
  flags: {
    guaranteed: { title: "Guaranteed returns", explain: "Promises of guaranteed investment returns can be a warning sign and should be independently verified.", simple: "No real investment can promise fixed profit. Be careful when someone says it is guaranteed." },
    highReturn: { title: "Unusually high returns", explain: "Very high returns over a short period are uncommon and should be treated with caution.", simple: "This is a lot of profit in very little time. That is rare in real investing." },
    urgency: { title: "Urgency & pressure", explain: "Pressure to act immediately can reduce the time available for independent verification.", simple: "They want you to hurry. Take your time — a genuine offer will still be there tomorrow." },
    payment: { title: "Payment request", explain: "Requests for upfront payments should be independently verified before sending money.", simple: "They are asking for money first. Do not pay until you have checked who they are." },
    messaging: { title: "Chat-app investment contact", explain: "Investment offers run through WhatsApp or Telegram contacts are harder to verify and are commonly used in solicitation scams.", simple: "They want to talk on WhatsApp or Telegram. Real companies rarely handle investments this way." },
    regulatory: { title: "Regulatory claim", explain: "Regulatory claims should be independently verified through official sources.", simple: "The message says it is approved by a regulator. Check this yourself on the regulator's official website." },
    insider: { title: "Exclusive or insider claim", explain: "Claims of special, exclusive or insider opportunities are often used to create excitement and lower caution.", simple: "They say it is a special secret offer. Such words are used to make you excited and less careful." },
    credentials: { title: "Sensitive information request", explain: "Requests for OTPs, passwords, PINs, CVVs or banking credentials are a serious warning sign.", simple: "Never tell anyone your OTP, password, PIN or CVV — not even someone who says they are from a bank." },
    verification: { title: "Account verification pressure", explain: "Messages threatening account blocks or demanding urgent KYC updates are commonly used for phishing.", simple: "They say your account will be blocked. Do not click links — contact your bank or broker directly." },
    hype: { title: "Promotional hype", explain: "Exaggerated promotional language can make claims seem more certain than they are.", simple: "Big exciting words like 'multibagger' or 'huge profits' do not prove anything." },
  },
  ui: {
    report: "Safety screening", indicators: "Risk indicators", detected: "Potential risk indicators detected", none: "No major warning signals detected",
    noneBody: "We did not find common scam signals in this content. Still, always verify before you invest.",
    why: "Why did we flag this?", signal: "Signal", evidence: "Evidence", matters: "Why it matters",
    whyMatters: "Why this matters", whyHigh: "This content contains multiple warning signals commonly associated with potentially unsafe investment solicitations.",
    whyMod: "This content contains some promotional or unverified claims. It may not be harmful, but it deserves careful independent checking.",
    whyLow: "This content does not show common warning signals. Low risk does not mean zero risk.",
    next: "Safer next steps", listen: "Listen to explanation", stop: "Stop", again: "Analyze another",
    disclaimer: "This screening does not establish whether content is fraudulent. The score represents detected warning signals, not legal certainty.",
    simple: "Simple Mode", local: "Local safety screening",
  },
  steps: ["Reading content...", "Detecting potential warning signals...", "Evaluating suspicious claims...", "Preparing your safety report..."],
  nextSteps: ["Don't transfer money based only on this message.", "Independently verify the organization and claim.", "Don't share OTPs, passwords, PINs or banking credentials.", "Use appropriate official reporting/grievance channels if you suspect fraud."],
};

const hi: Dict = {
  levels: { low: "कम जोखिम", moderate: "मध्यम जोखिम", high: "उच्च जोखिम", critical: "गंभीर जोखिम" },
  flags: {
    guaranteed: { title: "गारंटीड रिटर्न", explain: "निवेश पर गारंटीड रिटर्न का वादा एक चेतावनी संकेत हो सकता है और इसकी स्वतंत्र रूप से जांच करनी चाहिए।", simple: "कोई भी असली निवेश पक्का मुनाफा नहीं दे सकता। 'गारंटी' सुनकर सावधान रहें।" },
    highReturn: { title: "असामान्य रूप से ऊँचा रिटर्न", explain: "कम समय में बहुत ऊँचा रिटर्न असामान्य है और सावधानी से देखना चाहिए।", simple: "बहुत कम समय में बहुत ज़्यादा मुनाफा — असली निवेश में ऐसा कम होता है।" },
    urgency: { title: "जल्दबाज़ी और दबाव", explain: "तुरंत कार्य करने का दबाव स्वतंत्र जांच के लिए समय कम कर देता है।", simple: "वे आपको जल्दी करवाना चाहते हैं। समय लें — सच्चा ऑफ़र कल भी रहेगा।" },
    payment: { title: "भुगतान की मांग", explain: "पैसे भेजने से पहले अग्रिम भुगतान की मांग की स्वतंत्र रूप से जांच करें।", simple: "वे पहले पैसे मांग रहे हैं। जांचे बिना भुगतान न करें।" },
    messaging: { title: "चैट-ऐप पर निवेश संपर्क", explain: "WhatsApp या Telegram पर निवेश ऑफ़र की पुष्टि करना कठिन होता है।", simple: "वे WhatsApp या Telegram पर बात करना चाहते हैं। असली कंपनियाँ ऐसे निवेश नहीं करातीं।" },
    regulatory: { title: "नियामक दावा", explain: "नियामक मंज़ूरी के दावों की आधिकारिक स्रोतों से स्वतंत्र जांच करें।", simple: "संदेश कहता है कि यह नियामक से मंज़ूर है। इसे खुद आधिकारिक वेबसाइट पर जांचें।" },
    insider: { title: "विशेष या अंदरूनी दावा", explain: "'विशेष' या 'अंदरूनी' अवसर के दावे उत्साह बढ़ाकर सावधानी कम करते हैं।", simple: "वे इसे गुप्त खास ऑफ़र बता रहे हैं। ऐसे शब्द आपको लापरवाह बनाने के लिए होते हैं।" },
    credentials: { title: "संवेदनशील जानकारी की मांग", explain: "OTP, पासवर्ड, PIN, CVV या बैंक विवरण मांगना गंभीर चेतावनी संकेत है।", simple: "अपना OTP, पासवर्ड, PIN या CVV किसी को न बताएं — बैंक वाला बनकर आए व्यक्ति को भी नहीं।" },
    verification: { title: "खाता सत्यापन का दबाव", explain: "खाता बंद होने की धमकी या तुरंत KYC की मांग फ़िशिंग में आम है।", simple: "वे कहते हैं खाता बंद होगा। लिंक न खोलें — सीधे अपने बैंक से बात करें।" },
    hype: { title: "प्रचार की अतिशयोक्ति", explain: "बढ़ा-चढ़ाकर लिखी भाषा दावों को ज़्यादा पक्का दिखाती है।", simple: "'मल्टीबैगर' या 'भारी मुनाफा' जैसे शब्द कुछ साबित नहीं करते।" },
  },
  ui: {
    report: "सुरक्षा जांच", indicators: "जोखिम संकेतक", detected: "संभावित जोखिम संकेत मिले", none: "कोई बड़ा चेतावनी संकेत नहीं मिला",
    noneBody: "इस सामग्री में आम धोखाधड़ी संकेत नहीं मिले। फिर भी निवेश से पहले हमेशा जांचें।",
    why: "हमने इसे क्यों चिह्नित किया?", signal: "संकेत", evidence: "सबूत", matters: "यह क्यों मायने रखता है",
    whyMatters: "यह क्यों मायने रखता है", whyHigh: "इस सामग्री में कई ऐसे चेतावनी संकेत हैं जो अक्सर असुरक्षित निवेश प्रस्तावों में दिखते हैं।",
    whyMod: "इसमें कुछ प्रचारात्मक या असत्यापित दावे हैं। यह हानिकारक न भी हो, पर ध्यान से जांचें।",
    whyLow: "इसमें आम चेतावनी संकेत नहीं दिखे। कम जोखिम का मतलब शून्य जोखिम नहीं है।",
    next: "सुरक्षित अगले कदम", listen: "समझाइश सुनें", stop: "रोकें", again: "दूसरा संदेश जांचें",
    disclaimer: "यह जांच यह तय नहीं करती कि सामग्री धोखाधड़ी है। स्कोर केवल मिले चेतावनी संकेत दिखाता है, कानूनी निश्चितता नहीं।",
    simple: "सरल मोड", local: "स्थानीय सुरक्षा जांच",
  },
  steps: ["सामग्री पढ़ी जा रही है...", "संभावित चेतावनी संकेत खोजे जा रहे हैं...", "संदिग्ध दावों का मूल्यांकन...", "आपकी सुरक्षा रिपोर्ट तैयार हो रही है..."],
  nextSteps: ["केवल इस संदेश के आधार पर पैसे न भेजें।", "संस्था और दावे की स्वतंत्र रूप से जांच करें।", "OTP, पासवर्ड, PIN या बैंक विवरण साझा न करें।", "धोखाधड़ी का संदेह हो तो उचित आधिकारिक शिकायत माध्यम का उपयोग करें।"],
};

const mr: Dict = {
  levels: { low: "कमी धोका", moderate: "मध्यम धोका", high: "जास्त धोका", critical: "गंभीर धोका" },
  flags: {
    guaranteed: { title: "हमखास परतावा", explain: "गुंतवणुकीवर हमखास परताव्याचे आश्वासन हा धोक्याचा संकेत असू शकतो; त्याची स्वतंत्र पडताळणी करा.", simple: "कोणतीही खरी गुंतवणूक पक्का नफा देऊ शकत नाही. 'हमी' ऐकल्यावर सावध राहा." },
    highReturn: { title: "असामान्यपणे जास्त परतावा", explain: "कमी काळात खूप जास्त परतावा असामान्य आहे; सावधगिरी बाळगा.", simple: "खूप कमी वेळात खूप जास्त नफा — खऱ्या गुंतवणुकीत असे क्वचितच होते." },
    urgency: { title: "घाई आणि दबाव", explain: "लगेच निर्णय घेण्याचा दबाव स्वतंत्र पडताळणीचा वेळ कमी करतो.", simple: "ते तुम्हाला घाई करायला लावत आहेत. वेळ घ्या — खरी ऑफर उद्याही असेल." },
    payment: { title: "पैशांची मागणी", explain: "आगाऊ पैसे पाठवण्यापूर्वी त्या मागणीची स्वतंत्र पडताळणी करा.", simple: "ते आधी पैसे मागत आहेत. तपासल्याशिवाय पैसे देऊ नका." },
    messaging: { title: "चॅट-अॅपवरून गुंतवणूक संपर्क", explain: "WhatsApp किंवा Telegram वरील गुंतवणूक ऑफरची पडताळणी करणे कठीण असते.", simple: "ते WhatsApp किंवा Telegram वर बोलू इच्छितात. खऱ्या कंपन्या असे करत नाहीत." },
    regulatory: { title: "नियामक दावा", explain: "नियामक मान्यतेचे दावे अधिकृत स्रोतांकडून स्वतंत्रपणे तपासा.", simple: "संदेश म्हणतो की हे नियामकाने मंजूर केले आहे. हे स्वतः अधिकृत वेबसाइटवर तपासा." },
    insider: { title: "खास किंवा अंतर्गत दावा", explain: "'खास' किंवा 'अंतर्गत' संधीचे दावे उत्साह वाढवून सावधगिरी कमी करतात.", simple: "ते याला गुप्त खास ऑफर म्हणतात. असे शब्द तुम्हाला बेसावध करण्यासाठी असतात." },
    credentials: { title: "संवेदनशील माहितीची मागणी", explain: "OTP, पासवर्ड, PIN, CVV किंवा बँक तपशील मागणे हा गंभीर धोक्याचा संकेत आहे.", simple: "तुमचा OTP, पासवर्ड, PIN किंवा CVV कोणालाही सांगू नका." },
    verification: { title: "खाते पडताळणीचा दबाव", explain: "खाते बंद होण्याची धमकी किंवा तातडीची KYC मागणी फिशिंगमध्ये सामान्य आहे.", simple: "ते म्हणतात खाते बंद होईल. लिंक उघडू नका — थेट बँकेशी बोला." },
    hype: { title: "अतिशयोक्त प्रचार", explain: "फुगवलेली प्रचारात्मक भाषा दावे अधिक निश्चित वाटायला लावते.", simple: "'मल्टीबॅगर' किंवा 'प्रचंड नफा' असे शब्द काहीही सिद्ध करत नाहीत." },
  },
  ui: {
    report: "सुरक्षा तपासणी", indicators: "धोका निर्देशक", detected: "संभाव्य धोक्याचे संकेत आढळले", none: "कोणतेही मोठे धोक्याचे संकेत आढळले नाहीत",
    noneBody: "या मजकुरात सामान्य फसवणुकीचे संकेत आढळले नाहीत. तरीही गुंतवणुकीपूर्वी नेहमी तपासा.",
    why: "आम्ही हे का दाखवले?", signal: "संकेत", evidence: "पुरावा", matters: "हे का महत्त्वाचे आहे",
    whyMatters: "हे का महत्त्वाचे आहे", whyHigh: "या मजकुरात असुरक्षित गुंतवणूक प्रस्तावांमध्ये आढळणारे अनेक धोक्याचे संकेत आहेत.",
    whyMod: "यात काही प्रचारात्मक किंवा अपडताळलेले दावे आहेत. काळजीपूर्वक तपासा.",
    whyLow: "यात सामान्य धोक्याचे संकेत दिसले नाहीत. कमी धोका म्हणजे शून्य धोका नव्हे.",
    next: "सुरक्षित पुढील पावले", listen: "स्पष्टीकरण ऐका", stop: "थांबवा", again: "दुसरा संदेश तपासा",
    disclaimer: "ही तपासणी मजकूर फसवणूक आहे की नाही हे ठरवत नाही. गुण फक्त आढळलेले संकेत दर्शवतात, कायदेशीर निश्चितता नाही.",
    simple: "सोपा मोड", local: "स्थानिक सुरक्षा तपासणी",
  },
  steps: ["मजकूर वाचत आहे...", "संभाव्य धोक्याचे संकेत शोधत आहे...", "संशयास्पद दाव्यांचे मूल्यमापन...", "तुमचा सुरक्षा अहवाल तयार करत आहे..."],
  nextSteps: ["फक्त या संदेशावरून पैसे पाठवू नका.", "संस्था आणि दाव्याची स्वतंत्र पडताळणी करा.", "OTP, पासवर्ड, PIN किंवा बँक तपशील शेअर करू नका.", "फसवणुकीचा संशय असल्यास योग्य अधिकृत तक्रार माध्यम वापरा."],
};

export const DICTS: Record<Lang, Dict> = { en, hi, mr };
export const SPEECH_LANG: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; simple: boolean; setSimple: (b: boolean) => void; t: Dict };
const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("en");
  const [simple, setSimpleS] = useState(false);
  useEffect(() => {
    const l = localStorage.getItem("nr-lang") as Lang | null;
    if (l && l in DICTS) setLangS(l);
    setSimpleS(localStorage.getItem("nr-simple") === "1");
  }, []);
  const setLang = (l: Lang) => { setLangS(l); localStorage.setItem("nr-lang", l); };
  const setSimple = (b: boolean) => { setSimpleS(b); localStorage.setItem("nr-simple", b ? "1" : "0"); };
  return <I18n.Provider value={{ lang, setLang, simple, setSimple, t: DICTS[lang] }}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
