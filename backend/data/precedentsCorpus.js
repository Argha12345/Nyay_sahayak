/**
 * Verified Supreme Court Landmark Precedents Corpus
 * High-authority case law with precise SCC/AIR citations, Bench compositions,
 * ratio decidendi, and test criteria for automated grounding.
 */

export const PRECEDENTS_CORPUS = [
  {
    id: "PREC-SC-2022-ANTIL",
    caseTitle: "Satender Kumar Antil v. Central Bureau of Investigation & Anr.",
    citation: "(2022) 10 SCC 51",
    alternateCitation: "2022 LiveLaw (SC) 577",
    court: "Supreme Court of India",
    bench: "S.K. Kaul & M.M. Sundresh, JJ.",
    year: 2022,
    domain: "Criminal Procedure / Bail Guidelines",
    ratioDecidendi: "Categorization of offences into four classes (Category A: offences punishable with <= 7 years imprisonment). For Category A offences, if the accused was not arrested during investigation and cooperated with the police complying with Section 41A CrPC, on appearance before court upon chargesheet summons, bail application ought to be decided without remanding the accused to physical custody.",
    keywords: ["bail", "Category A", "Section 41A", "custody not required", "Satender Antil", "cooperation in investigation"],
    keyQuotes: [
      "If the accused was not arrested during the investigation and has cooperated throughout the investigation including appearing before the Investigating Officer whenever called, ordinary bail applications must be decided without taking him into physical custody.",
      "The rate of undertrial prisoners in India is alarmingly disproportionate. Bail is the rule and jail is an exception."
    ],
    applicabilityTest: "Offence carries punishment up to 7 years imprisonment (such as Section 420 IPC / 318(4) BNS), accused was not arrested during probe, cooperated with IO, or police failed to serve Section 41A notice."
  },
  {
    id: "PREC-SC-2014-ARNESH",
    caseTitle: "Arnesh Kumar v. State of Bihar & Anr.",
    citation: "(2014) 8 SCC 273",
    alternateCitation: "AIR 2014 SC 2756",
    court: "Supreme Court of India",
    bench: "Chandramauli Kr. Prasad & Pinaki Chandra Ghose, JJ.",
    year: 2014,
    domain: "Criminal Procedure / Arrest Safeguards",
    ratioDecidendi: "Arrest cannot be made mechanically in offences where imprisonment is up to seven years. Police officers must serve a notice under Section 41A CrPC within two weeks from the date of institution of the case. Failure to comply with Section 41/41A renders the arresting officer liable for departmental proceedings and contempt of court.",
    keywords: ["Arnesh Kumar", "Section 41A CrPC", "arrest guidelines", "arbitrary arrest", "notice of appearance"],
    keyQuotes: [
      "Arrest brings humiliation, curtails freedom and casts scars forever. No arrest can be made in a routine manner on a mere allegation of commission of an offence punishable up to 7 years without satisfying the prerequisites of Section 41 CrPC.",
      "A notice of appearance in terms of Section 41A CrPC be served on the accused within two weeks from the date of institution of the case."
    ],
    applicabilityTest: "Challenge to legality of arrest or seeking bail where the investigating officer effected arrest without issuing or complying with mandatory Section 41A/35(3) notice."
  },
  {
    id: "PREC-SC-2012-SANJAY",
    caseTitle: "Sanjay Chandra v. Central Bureau of Investigation",
    citation: "(2012) 1 SCC 40",
    alternateCitation: "AIR 2012 SC 830",
    court: "Supreme Court of India",
    bench: "G.S. Singhvi & H.L. Dattu, JJ.",
    year: 2012,
    domain: "Criminal Procedure / Economic Offences & Liberty",
    ratioDecidendi: "Deprivation of liberty must be considered a punishment. The primary object of bail is to secure the attendance of the accused at trial. Even in economic offences where documentary evidence has been seized and chargesheet filed, prolonged incarceration without trial violates Article 21.",
    keywords: ["Sanjay Chandra", "bail rule jail exception", "economic offence", "prolonged incarceration", "attendance at trial"],
    keyQuotes: [
      "The grant of bail is the rule and denial is the exception. The court must balance the personal liberty of the accused against the interest of society.",
      "Pre-trial detention cannot be punitive in nature. In economic offences, where documents are already in custody of the investigating agency, further detention is unjustified."
    ],
    applicabilityTest: "Bail in economic/financial disputes where documentary evidence is already seized, chargesheet is submitted, and no tampering risk exists."
  },
  {
    id: "PREC-SC-2020-KHOTKAR",
    caseTitle: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal & Ors.",
    citation: "(2020) 7 SCC 1",
    alternateCitation: "AIR 2020 SC 4917",
    court: "Supreme Court of India",
    bench: "R.F. Nariman, S. Ravindra Bhat & V. Ramasubramanian, JJ.",
    year: 2020,
    domain: "Law of Evidence / Electronic Records",
    ratioDecidendi: "A certificate under Section 65B(4) of the Indian Evidence Act is mandatory and a condition precedent to the admissibility of secondary electronic evidence (e.g. printouts, server logs, CDRs, CCTV footage). Absence of a contemporaneous 65B certificate renders electronic evidence inadmissible.",
    keywords: ["Section 65B", "electronic evidence", "mandatory certificate", "CDRs", "digital logs", "admissibility"],
    keyQuotes: [
      "The certificate required under Section 65B(4) is a condition precedent to the admissibility of evidence by way of electronic record.",
      "An electronic record produced by a computer without such certificate is legally inadmissible in evidence."
    ],
    applicabilityTest: "Reviewing prosecution digital evidence, WhatsApp chats, server logs, or email printouts lacking Section 65B(4) BSA / Section 63 BSA certificate."
  },
  {
    id: "PREC-SC-2003-ONGC",
    caseTitle: "Oil & Natural Gas Corporation Ltd. v. Saw Pipes Ltd.",
    citation: "(2003) 5 SCC 705",
    alternateCitation: "AIR 2003 SC 2629",
    court: "Supreme Court of India",
    bench: "M.B. Shah & Arun Kumar, JJ.",
    year: 2003,
    domain: "Contract Law / Liquidated Damages & Penalty",
    ratioDecidendi: "Under Section 74 of the Indian Contract Act, if the contractual sum represents a genuine pre-estimate of loss agreed by the parties, the aggrieved party is entitled to recover reasonable damages without proving actual loss. However, if the clause is penal or extortionate, the court will only grant reasonable compensation based on actual injury.",
    keywords: ["ONGC v Saw Pipes", "liquidated damages", "Section 74", "pre-estimate of loss", "penalty clause"],
    keyQuotes: [
      "If the terms of the contract are clear and unambiguous, stipulating liquidated damages in case of breach, unless the court comes to a conclusion that such sum is in the nature of penalty, the party complaining is entitled to recover reasonable damages.",
      "In terms of Section 74, the court is competent to award reasonable compensation in case of breach even if no actual damage is proved."
    ],
    applicabilityTest: "Contractual disputes involving liquidated damages, delay penalties, or claims for compensation under commercial service contracts."
  },
  {
    id: "PREC-SC-2017-ENERGY",
    caseTitle: "Energy Watchdog v. Central Electricity Regulatory Commission & Ors.",
    citation: "(2017) 14 SCC 80",
    alternateCitation: "AIR 2017 SC 2084",
    court: "Supreme Court of India",
    bench: "P.C. Ghose & R.F. Nariman, JJ.",
    year: 2017,
    domain: "Contract Law / Force Majeure & Frustration",
    ratioDecidendi: "Doctrine of frustration under Section 56 of the Indian Contract Act applies only when the performance of an act becomes completely impossible or unlawful. Mere commercial difficulty, economic unviability, rise in input prices, or onerous burdens do not constitute frustration or invoke force majeure.",
    keywords: ["Energy Watchdog", "force majeure", "Section 56", "commercial impossibility", "onerous performance"],
    keyQuotes: [
      "The doctrine of frustration cannot be applied where there is merely an increase in price or change of circumstances which makes performance more onerous.",
      "Force majeure clauses are to be construed strictly according to the express terms agreed upon by the commercial parties."
    ],
    applicabilityTest: "Contract review where a party attempts to excuse breach, non-performance, or delay citing market fluctuations or force majeure clauses."
  },
  {
    id: "PREC-SC-1978-MANEKA",
    caseTitle: "Maneka Gandhi v. Union of India",
    citation: "AIR 1978 SC 597",
    alternateCitation: "(1978) 1 SCC 248",
    court: "Supreme Court of India",
    bench: "M.H. Beg, C.J., Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer et al.",
    year: 1978,
    domain: "Constitutional Law / Article 21 & Personal Liberty",
    ratioDecidendi: "Procedure established by law under Article 21 must be 'right, just and fair', not arbitrary, fanciful or oppressive. The principles of natural justice are an integral part of fair procedure. Any deprivation of personal liberty without fair hearing and procedural safeguards is unconstitutional.",
    keywords: ["Maneka Gandhi", "Article 21", "personal liberty", "just fair and reasonable", "natural justice"],
    keyQuotes: [
      "The procedure contemplated by Article 21 must answer the test of reasonableness in order to be in conformity with Article 14.",
      "No person shall be deprived of his life or personal liberty except according to procedure established by law which must be just, fair and reasonable."
    ],
    applicabilityTest: "Constitutional grounds in criminal bail or quashing petitions challenging procedural unfairness, arbitrary custody, or denial of hearing."
  }
];
