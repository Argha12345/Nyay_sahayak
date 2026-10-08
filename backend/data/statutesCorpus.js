/**
 * Verified Statutory Corpus
 * Contains authoritative provisions across Bharatiya Nyaya Sanhita (BNS) / IPC,
 * Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC,
 * Bharatiya Sakshya Adhiniyam (BSA) / Indian Evidence Act,
 * and Indian Contract Act 1872.
 */

export const STATUTES_CORPUS = [
  {
    id: "STAT-BNSS-483",
    code: "BNSS / CrPC",
    section: "Section 483 BNSS (equiv. Section 439 CrPC)",
    title: "Special powers of High Court or Court of Session regarding bail",
    summary: "A High Court or Court of Session may direct that any person accused of an offence and in custody be released on bail, and if the offence is of the nature specified in sub-section (3) of section 480, may impose any condition which it considers necessary.",
    keywords: ["bail", "custody", "High Court", "Sessions Court", "regular bail", "liberty"],
    verifiableText: "A High Court or Court of Session may direct that any person accused of an offence and in custody be released on bail; and if the offence is of the nature specified in sub-section (3) of section 480, may impose any condition which it considers necessary for the purposes mentioned in that sub-section; and that any condition imposed by a Magistrate when admitting any person to bail be set aside or modified.",
    crossReference: "Section 439 Code of Criminal Procedure, 1973"
  },
  {
    id: "STAT-BNSS-35",
    code: "BNSS / CrPC",
    section: "Section 35(3) BNSS (equiv. Section 41A CrPC)",
    title: "Notice of appearance before police officer",
    summary: "The police officer shall, in all cases where the arrest of a person is not required under sub-section (1) of section 35, issue a notice directing the person against whom a reasonable complaint has been made or credible information has been received, to appear before him.",
    keywords: ["arrest", "41A", "notice of appearance", "mandatory notice", "liberty", "pre-arrest"],
    verifiableText: "The police officer shall, in all cases where the arrest of a person is not required under the provisions of sub-section (1) of section 35, issue a notice directing the person against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists that he has committed a cognizable offence, to appear before him or at such other place as may be specified in the notice.",
    crossReference: "Section 41A Code of Criminal Procedure, 1973; Arnesh Kumar v. State of Bihar (2014)"
  },
  {
    id: "STAT-BNSS-480",
    code: "BNSS / CrPC",
    section: "Section 480 BNSS (equiv. Section 437 CrPC)",
    title: "When bail may be taken in case of non-bailable offence",
    summary: "Discretion of Magistrate to grant bail in non-bailable matters, providing special latitude for sick, infirm, or women, and barring bail only when reasonable grounds exist for believing guilt of offences punishable with death or life imprisonment.",
    keywords: ["Magistrate bail", "non-bailable", "sick", "infirm", "women", "life imprisonment"],
    verifiableText: "When any person accused of, or suspected of, the commission of any non-bailable offence is arrested or detained without warrant by an officer in charge of a police station or appears or is brought before a Court other than the High Court or Court of Session, he may be released on bail, but he shall not be so released if there appear reasonable grounds for believing that he has been guilty of an offence punishable with death or imprisonment for life.",
    crossReference: "Section 437 Code of Criminal Procedure, 1973"
  },
  {
    id: "STAT-BNS-318",
    code: "BNS / IPC",
    section: "Section 318(4) BNS (equiv. Section 420 IPC)",
    title: "Cheating and dishonestly inducing delivery of property",
    summary: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment for a term which may extend to seven years, and shall also be liable to fine.",
    keywords: ["cheating", "fraud", "dishonest inducement", "delivery of property", "420 IPC", "318 BNS"],
    verifiableText: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    crossReference: "Section 420 Indian Penal Code, 1860"
  },
  {
    id: "STAT-BNS-316",
    code: "BNS / IPC",
    section: "Section 316 BNS (equiv. Section 405/406 IPC)",
    title: "Criminal breach of trust",
    summary: "Entrustment of property and subsequent dishonest misappropriation or conversion to own use or violation of legal contract.",
    keywords: ["criminal breach of trust", "entrustment", "misappropriation", "406 IPC"],
    verifiableText: "Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law prescribing the mode in which such trust is to be discharged, commits criminal breach of trust.",
    crossReference: "Section 405 & 406 Indian Penal Code, 1860"
  },
  {
    id: "STAT-BSA-63",
    code: "BSA / Evidence Act",
    section: "Section 63 BSA (equiv. Section 65B Indian Evidence Act)",
    title: "Admissibility of electronic records",
    summary: "Any information contained in an electronic record produced by a computer shall be deemed to be also a document and admissible in evidence without further proof or production of the original, subject to certificate verifying device integrity.",
    keywords: ["electronic evidence", "65B certificate", "digital proof", "server logs", "device integrity"],
    verifiableText: "Notwithstanding anything contained in this Adhiniyam, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media produced by a computer shall be deemed to be also a document... and shall be admissible in any proceedings, without further proof or production of the original, if the conditions mentioned in this section are satisfied in relation to the information and computer in question.",
    crossReference: "Section 65B Indian Evidence Act, 1872; Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020)"
  },
  {
    id: "STAT-BSA-23",
    code: "BSA / Evidence Act",
    section: "Section 23 BSA (equiv. Section 25 Indian Evidence Act)",
    title: "Confession to police officer not to be proved",
    summary: "No confession made to a police officer shall be proved as against a person accused of any offence.",
    keywords: ["police confession", "inadmissible", "custodial statement", "Section 25 Evidence Act"],
    verifiableText: "No confession made to a police officer shall be proved as against a person accused of any offence.",
    crossReference: "Section 25 Indian Evidence Act, 1872"
  },
  {
    id: "STAT-CONTRACT-73",
    code: "Indian Contract Act",
    section: "Section 73 Indian Contract Act, 1872",
    title: "Compensation for loss or damage caused by breach of contract",
    summary: "When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things.",
    keywords: ["breach of contract", "damages", "compensation", "natural loss", "proximate cause"],
    verifiableText: "When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it.",
    crossReference: "Hadley v Baxendale (1854); Section 73 Indian Contract Act 1872"
  },
  {
    id: "STAT-CONTRACT-74",
    code: "Indian Contract Act",
    section: "Section 74 Indian Contract Act, 1872",
    title: "Compensation for breach of contract where penalty stipulated for",
    summary: "When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, the party complaining of the breach is entitled to receive reasonable compensation not exceeding the amount so named.",
    keywords: ["liquidated damages", "penalty", "reasonable compensation", "stipulation by way of penalty"],
    verifiableText: "When a contract has been broken, if a sum is named in the contract as the amount to be paid in case of such breach, or if the contract contains any other stipulation by way of penalty, the party complaining of the breach is entitled, whether or not actual damage or loss is proved to have been caused thereby, to receive from the party who has broken the contract reasonable compensation not exceeding the amount so named or, as the case may be, the penalty stipulated for.",
    crossReference: "ONGC v. Saw Pipes Ltd. (2003); Kailash Nath Associates v. DDA (2015)"
  },
  {
    id: "STAT-CONTRACT-56",
    code: "Indian Contract Act",
    section: "Section 56 Indian Contract Act, 1872",
    title: "Agreement to do impossible act / Frustration of Contract",
    summary: "An agreement to do an act impossible in itself is void. A contract to do an act which, after the contract is made, becomes impossible, or, by reason of some event which the promisor could not prevent, unlawful, becomes void when the act becomes impossible or unlawful.",
    keywords: ["frustration", "force majeure", "impossibility", "supervening event"],
    verifiableText: "An agreement to do an act impossible in itself is void. A contract to do an act which, after the contract is made, becomes impossible, or, by reason of some event which the promisor could not prevent, unlawful, becomes void when the act becomes impossible or unlawful.",
    crossReference: "Satyabrata Ghose v. Mugneeram Bangur (1954); Energy Watchdog v. CERC (2017)"
  }
];
