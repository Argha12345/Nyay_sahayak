/**
 * Benchmark Legal Cases for Testing & Live Demonstration
 * Contains multi-document case dossiers with ground-truth facts,
 * verified citations, deliberate contradictions, and missing evidentiary gaps.
 */

export const SAMPLE_CASES = [
  {
    id: "CASE-CRIM-001",
    title: "State of Karnataka v. Vikramaditya Sen (Cyber Crime PS Bangalore)",
    type: "Criminal - Bail & Quashing",
    category: "Criminal Law / Section 420 IPC (318(4) BNS)",
    summary: "Allegation of defrauding investors of INR 45 Lakhs in an algorithmic crypto arbitrage venture. Accused arrested without Section 41A notice. Blatant physical alibi contradiction between Complainant statement and immigration records.",
    targetWorkflows: ["case_review", "legal_drafting", "legal_research", "rag_chat"],
    documents: [
      {
        id: "DOC-FIR-182",
        title: "First Information Report (FIR No. 182/2024)",
        type: "FIR / Police Record",
        date: "2024-10-24",
        source: "Cyber Crime Police Station, Bangalore City",
        paragraphs: [
          {
            paraId: "DOC-FIR-182:P1",
            paraNum: 1,
            text: "First Information Report registered under Section 154 CrPC / 173 BNSS at Cyber Crime Police Station, Bangalore, on 24th October 2024 at 14:15 hrs upon written complaint of Shri Rajesh Khurana."
          },
          {
            paraId: "DOC-FIR-182:P2",
            paraNum: 2,
            text: "Named Accused: Shri Vikramaditya Sen, aged 34 years, residing at Flat 402, Prestige Palms, Indiranagar, Bengaluru. Offence alleged: Section 420 (Cheating and dishonestly inducing delivery of property) read with Section 406 of Indian Penal Code (equivalent Sections 318(4) and 316 BNS)."
          },
          {
            paraId: "DOC-FIR-182:P3",
            paraNum: 3,
            text: "Substance of Informant Allegation: The complainant alleges that in September 2024, the accused represented himself as managing an algorithmic high-frequency cryptocurrency arbitrage fund promising guaranteed returns of 18% per quarter, and induced the complainant to invest INR 45,00,000."
          },
          {
            paraId: "DOC-FIR-182:P4",
            paraNum: 4,
            text: "The complainant alleges that INR 20,00,000 was transferred via NEFT/RTGS to HDFC Bank account of accused, and remaining INR 25,00,000 was delivered in cash in person to accused on 12th October 2024 at 16:30 hrs at Starbucks Indiranagar, Bengaluru."
          },
          {
            paraId: "DOC-FIR-182:P5",
            paraNum: 5,
            text: "IO assigned: Inspector K. N. Gowda. Investigating agency initiated verification of digital trail and seized bank statements."
          }
        ]
      },
      {
        id: "DOC-WIT-KHURANA",
        title: "Statement of Complainant Rajesh Khurana under S. 161 CrPC",
        type: "Witness Statement / Section 161",
        date: "2024-10-28",
        source: "Investigating Officer, Cyber Crime PS",
        paragraphs: [
          {
            paraId: "DOC-WIT-KHURANA:P1",
            paraNum: 1,
            text: "Statement of Shri Rajesh Khurana, son of late O. P. Khurana, aged 49 years, businessman, recorded under Section 161 CrPC (Section 180 BNSS) on 28th October 2024."
          },
          {
            paraId: "DOC-WIT-KHURANA:P2",
            paraNum: 2,
            text: "I met Vikramaditya Sen through mutual acquaintances at Bangalore Club. He showcased a dashboard on his iPad indicating steady 6% monthly yield from arbitrage trading on Binance and Bybit."
          },
          {
            paraId: "DOC-WIT-KHURANA:P3",
            paraNum: 3,
            text: "On 28th September 2024, I remitted INR 20,00,000 from my ICICI Bank Current Account No. 00410500129 to his account. He acknowledged receipt via WhatsApp chat."
          },
          {
            paraId: "DOC-WIT-KHURANA:P4",
            paraNum: 4,
            text: "Subsequently, on 12th October 2024 at exactly 16:30 hrs, I personally met Vikramaditya Sen at Starbucks coffee shop in Indiranagar, Bengaluru, and handed him a sealed leather briefcase containing INR 25,00,000 in currency notes of 500 denomination, for which he promised a notarized debenture certificate."
          },
          {
            paraId: "DOC-WIT-KHURANA:P5",
            paraNum: 5,
            text: "From 18th October 2024, his mobile phone was switched off and his office at Indiranagar was found locked. I realized I was cheated and hence lodged the FIR."
          }
        ]
      },
      {
        id: "DOC-BANK-AXIS",
        title: "Bank Compliance & Audit Report (Axis & HDFC Ledger)",
        type: "Financial Record / Banking Audit",
        date: "2024-11-04",
        source: "Fraud Risk Management Cell, Axis Bank Ltd.",
        paragraphs: [
          {
            paraId: "DOC-BANK-AXIS:P1",
            paraNum: 1,
            text: "Official verification response issued by Fraud Risk Management Cell, Axis Bank Ltd, in response to police requisition notice u/s 91 CrPC (Section 94 BNSS)."
          },
          {
            paraId: "DOC-BANK-AXIS:P2",
            paraNum: 2,
            text: "Regarding Account No. 919020048123990 standing in the name of M/s Sen Algorithmic Research LLP: The credit of INR 20,00,000 on 28-09-2024 from ICICI Bank is verified."
          },
          {
            paraId: "DOC-BANK-AXIS:P3",
            paraNum: 3,
            text: "Audit reveals that out of the INR 20,00,000 received, INR 18,50,000 was legitimately deployed via API to WazirX and CoinDCX corporate crypto exchange accounts under verified institutional KYC for spot-market hedging."
          },
          {
            paraId: "DOC-BANK-AXIS:P4",
            paraNum: 4,
            text: "There is NO record of any cash deposit of INR 25,00,000 into any linked account of Vikramaditya Sen or Sen Algorithmic Research LLP between 01-10-2024 and 31-10-2024."
          },
          {
            paraId: "DOC-BANK-AXIS:P5",
            paraNum: 5,
            text: "The remaining balance of INR 1,50,000 in the account has been placed under freeze pursuant to police notice dated 26-10-2024."
          }
        ]
      },
      {
        id: "DOC-ALIBI-IMMIGRATION",
        title: "Accused Alibi: Bureau of Immigration Travel Manifest & Boarding Passes",
        type: "Official Government Records / Alibi Evidence",
        date: "2024-11-08",
        source: "Bureau of Immigration, Kempegowda International Airport (BLR)",
        paragraphs: [
          {
            paraId: "DOC-ALIBI-IMMIGRATION:P1",
            paraNum: 1,
            text: "Certified passenger movement manifest issued by Bureau of Immigration, Ministry of Home Affairs, Government of India, regarding Indian Passport Holder Vikramaditya Sen (Passport No. Z4829104)."
          },
          {
            paraId: "DOC-ALIBI-IMMIGRATION:P2",
            paraNum: 2,
            text: "Departure Record: Subject departed India from Kempegowda International Airport, Bengaluru on 11th October 2024 at 08:15 hrs IST aboard Singapore Airlines Flight SQ-503 to Changi Airport, Singapore."
          },
          {
            paraId: "DOC-ALIBI-IMMIGRATION:P3",
            paraNum: 3,
            text: "Hotel & Conference Presence: Subject checked into Marina Bay Sands Hotel, Singapore on 11th October 2024 at 16:45 SGT and was a registered speaker at the APAC FinTech Summit on 12th October 2024 from 14:00 to 18:00 SGT (11:30 to 15:30 IST)."
          },
          {
            paraId: "DOC-ALIBI-IMMIGRATION:P4",
            paraNum: 4,
            text: "Arrival Record: Subject returned to India via BLR Airport on 16th October 2024 at 23:40 hrs IST aboard Singapore Airlines Flight SQ-502."
          },
          {
            paraId: "DOC-ALIBI-IMMIGRATION:P5",
            paraNum: 5,
            text: "Conclusion on Physical Presence: On 12th October 2024 at 16:30 hrs IST, subject was physically in the Republic of Singapore, geographically over 3,000 kilometers away from Indiranagar, Bengaluru."
          }
        ]
      },
      {
        id: "DOC-ARREST-MEMO",
        title: "Arrest Memo & Seizure Panchnama of Police",
        type: "Police Procedural Document / Arrest Record",
        date: "2024-11-14",
        source: "Cyber Crime Police Station, Bangalore City",
        paragraphs: [
          {
            paraId: "DOC-ARREST-MEMO:P1",
            paraNum: 1,
            text: "Arrest Memo: Vikramaditya Sen arrested on 14th November 2024 at 09:30 hrs from his residence at Prestige Palms, Bengaluru, by Sub-Inspector V. Ramesh without warrant."
          },
          {
            paraId: "DOC-ARREST-MEMO:P2",
            paraNum: 2,
            text: "Procedural Compliance: No notice under Section 41A CrPC (Section 35(3) BNSS) was issued or served prior to arrest. Arrest Memo states arrest was effected directly on apprehension that accused might leave jurisdiction."
          },
          {
            paraId: "DOC-ARREST-MEMO:P3",
            paraNum: 3,
            text: "Seizure: Seized 1 Apple iPhone 15 Pro and 1 MacBook Air from accused possession. WhatsApp chat screenshots exported by police officer onto a thumb drive."
          },
          {
            paraId: "DOC-ARREST-MEMO:P4",
            paraNum: 4,
            text: "Certification Status: No certificate under Section 65B(4) Indian Evidence Act / Section 63 BSA has been executed or submitted by the seizing officer or system administrator at the time of electronic data seizure."
          },
          {
            paraId: "DOC-ARREST-MEMO:P5",
            paraNum: 5,
            text: "Accused remanded to judicial custody by learned 1st Additional Chief Metropolitan Magistrate (ACMM), Bengaluru, on 15th November 2024."
          }
        ]
      }
    ],
    groundTruthFacts: [
      {
        fact: "Accused Vikramaditya Sen was arrested on 14th November 2024 under Section 420 IPC / 318(4) BNS.",
        sourceDocId: "DOC-ARREST-MEMO",
        paraId: "DOC-ARREST-MEMO:P1",
        verbatimSpan: "Vikramaditya Sen arrested on 14th November 2024 at 09:30 hrs"
      },
      {
        fact: "No mandatory notice under Section 41A CrPC (Section 35(3) BNSS) was issued or served prior to arrest.",
        sourceDocId: "DOC-ARREST-MEMO",
        paraId: "DOC-ARREST-MEMO:P2",
        verbatimSpan: "No notice under Section 41A CrPC (Section 35(3) BNSS) was issued or served prior to arrest."
      },
      {
        fact: "On 12th October 2024 at 16:30 hrs, accused was physically in Singapore, refuting the complainant's claim of physical cash collection in Bangalore.",
        sourceDocId: "DOC-ALIBI-IMMIGRATION",
        paraId: "DOC-ALIBI-IMMIGRATION:P5",
        verbatimSpan: "On 12th October 2024 at 16:30 hrs IST, subject was physically in the Republic of Singapore"
      },
      {
        fact: "The digital seizure of WhatsApp chat logs lacks mandatory certificate under Section 65B(4) Evidence Act / Section 63 BSA.",
        sourceDocId: "DOC-ARREST-MEMO",
        paraId: "DOC-ARREST-MEMO:P4",
        verbatimSpan: "No certificate under Section 65B(4) Indian Evidence Act / Section 63 BSA has been executed"
      },
      {
        fact: "Out of INR 20,00,000 received, INR 18,50,000 was legitimately deployed into institutional crypto exchange hedging accounts.",
        sourceDocId: "DOC-BANK-AXIS",
        paraId: "DOC-BANK-AXIS:P3",
        verbatimSpan: "INR 18,50,000 was legitimately deployed via API to WazirX and CoinDCX corporate crypto exchange accounts"
      }
    ],
    knownContradictions: [
      {
        contradictionId: "CONTRA-001",
        severity: "CRITICAL",
        category: "Temporal / Physical Alibi",
        claimA: {
          speaker: "Complainant Rajesh Khurana (DOC-WIT-KHURANA:P4)",
          text: "Personally met accused at Starbucks Indiranagar Bengaluru on 12th October 2024 at 16:30 hrs and handed INR 25,00,000 cash in a leather briefcase."
        },
        claimB: {
          speaker: "Bureau of Immigration & Travel Manifest (DOC-ALIBI-IMMIGRATION:P2 & P5)",
          text: "Accused departed India on 11th Oct 2024 on flight SQ-503 and was physically present in Singapore at APAC FinTech Summit on 12th Oct 2024 until 16th Oct 2024."
        },
        legalImpact: "Discredits complainant's assertion of Rs. 25,00,000 cash transaction; establishes fabricated allegation; provides decisive ground for bail and quashing under Section 482 CrPC / 528 BNSS."
      },
      {
        contradictionId: "CONTRA-002",
        severity: "HIGH",
        category: "Financial Discrepancy",
        claimA: {
          speaker: "Complainant FIR & Statement (DOC-FIR-182:P4, DOC-WIT-KHURANA:P4)",
          text: "Alleges total siphoning of INR 45,00,000 (INR 20L bank transfer + INR 25L cash handed over)."
        },
        claimB: {
          speaker: "Axis Bank Audit Report (DOC-BANK-AXIS:P4)",
          text: "Zero record of any cash deposit of INR 25,00,000 into accused or LLP accounts; remaining bank funds were verified crypto exchange hedge deployments, not personal misappropriation."
        },
        legalImpact: "Negates ingredients of dishonest misappropriation under Section 406/420 IPC; establishes commercial venture dispute rather than criminal conspiracy."
      }
    ],
    missingInformation: [
      {
        gapId: "GAP-001",
        item: "Mandatory Section 41A CrPC / 35(3) BNSS Pre-Arrest Notice",
        status: "FATALLY_ABSENT",
        ruleRef: "Arnesh Kumar v. State of Bihar (2014) 8 SCC 273; Satender Kumar Antil (2022) 10 SCC 51",
        recommendation: "Highlight arbitrary arrest without compliance in bail grounds; petition for release on personal bond under Satender Antil Category A guidelines."
      },
      {
        gapId: "GAP-002",
        item: "Section 65B(4) / Section 63 BSA Electronic Evidence Certificate",
        status: "ABSENT",
        ruleRef: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) 7 SCC 1",
        recommendation: "WhatsApp chat logs and phone data cannot be relied upon by prosecution at charge-framing stage without contemporaneous 65B certificate."
      },
      {
        gapId: "GAP-003",
        item: "Independent Eyewitness / Starbucks CCTV Footage for 12-Oct Cash Handover",
        status: "UNCOLLECTED_BY_IO",
        ruleRef: "Section 102/105 BNSS / Police Manual",
        recommendation: "Move application under Section 91 CrPC (Section 94 BNSS) for preservation of Starbucks Indiranagar CCTV footage and tower location records."
      }
    ]
  },
  {
    id: "CASE-COMM-002",
    title: "Apex Solutions Ltd. v. Quantix Cloud Inc. (Master SaaS Agreement)",
    type: "Commercial Contract Review & Dispute",
    category: "Contract Law / Breach, Termination & Liquidated Damages",
    summary: "Review of 3-year Enterprise SaaS Cloud Licensing Agreement. Catastrophic contradictions between Termination for Convenience vs Liquidated Damages Lock-in, and Limitation of Liability vs Uncapped Indemnity.",
    targetWorkflows: ["case_review", "legal_drafting", "legal_research", "rag_chat"],
    documents: [
      {
        id: "DOC-AGREE-SAAS",
        title: "Master Software-as-a-Service & Cloud Licensing Agreement",
        type: "Commercial Contract",
        date: "2023-04-15",
        source: "Executed Contract between Apex Solutions Ltd and Quantix Cloud Inc",
        paragraphs: [
          {
            paraId: "DOC-AGREE-SAAS:P1",
            paraNum: 1,
            text: "This Master Cloud Services Agreement ('Agreement') is entered on 15th April 2023 by and between Apex Solutions Ltd ('Customer') and Quantix Cloud Inc ('Provider'). Term commences on 1st May 2023 for an initial duration of 36 months ('Initial Term'). Annual recurring subscription fee is USD 180,000 payable quarterly in advance."
          },
          {
            paraId: "DOC-AGREE-SAAS:P2",
            paraNum: 2,
            text: "Clause 4.2 (Termination for Convenience): 'Notwithstanding anything to the contrary in this Agreement, Customer may terminate this Agreement at any time, with or without cause, by giving thirty (30) days prior written notice to Provider. Upon such termination, Customer shall only be obligated to pay for services rendered up to the effective termination date, with no additional penalty or forfeiture.'"
          },
          {
            paraId: "DOC-AGREE-SAAS:P3",
            paraNum: 3,
            text: "Clause 8.1 (Limitation of Liability): 'To the maximum extent permitted by applicable law, neither party's aggregate cumulative liability arising out of or related to this Agreement shall exceed the total fees actually paid by Customer in the twelve (12) months preceding the incident giving rise to liability.'"
          },
          {
            paraId: "DOC-AGREE-SAAS:P4",
            paraNum: 4,
            text: "Clause 9.3 (Customer Indemnification): 'Customer agrees to defend, indemnify, and hold harmless Provider from and against any and all third-party claims, losses, damages, liabilities, and legal expenses arising out of any Customer data breach, user misuse, or alleged infringement, without limitation of liability or cap.'"
          },
          {
            paraId: "DOC-AGREE-SAAS:P5",
            paraNum: 5,
            text: "Clause 14.1 (Mandatory Lock-in and Liquidated Damages): 'The Initial Term of 36 months is irrevocable and non-cancellable. In the event Customer attempts to terminate or ceases paying subscription fees prior to the completion of 36 months, Customer shall be immediately liable to pay liquidated damages equal to 100% of all unpaid subscription fees for the remainder of the Initial Term as a genuine pre-estimate of loss.'"
          },
          {
            paraId: "DOC-AGREE-SAAS:P6",
            paraNum: 6,
            text: "Clause 18.4 (Governing Law & Dispute Resolution): 'This Agreement shall be governed by the laws of England and Wales and the Republic of India. In case of dispute, courts in both London and Mumbai shall have concurrent non-exclusive jurisdiction. The parties may refer disputes to arbitration.'"
          }
        ]
      },
      {
        id: "DOC-NOTICE-DISPUTE",
        title: "Notice of Early Termination sent by Apex Solutions",
        type: "Legal Notice",
        date: "2024-09-10",
        source: "Legal Counsel, Apex Solutions Ltd",
        paragraphs: [
          {
            paraId: "DOC-NOTICE-DISPUTE:P1",
            paraNum: 1,
            text: "Formal legal notice served by Apex Solutions Ltd on 10th September 2024 invoking Clause 4.2 of the Agreement, providing 30 days written notice to terminate effective 10th October 2024 due to corporate restructuring."
          },
          {
            paraId: "DOC-NOTICE-DISPUTE:P2",
            paraNum: 2,
            text: "Apex Solutions tendered payment of USD 15,000 for pro-rata services rendered through 10th October 2024 and disclaimed liability for any future quarterly fees."
          }
        ]
      },
      {
        id: "DOC-REPLY-DEMAND",
        title: "Reply & Counter-Demand for Liquidated Damages by Quantix Cloud",
        type: "Demand Notice",
        date: "2024-09-22",
        source: "General Counsel, Quantix Cloud Inc",
        paragraphs: [
          {
            paraId: "DOC-REPLY-DEMAND:P1",
            paraNum: 1,
            text: "Reply dated 22nd September 2024 rejecting notice of termination under Clause 4.2. Quantix Cloud asserts Clause 14.1 supersedes Clause 4.2 and establishes an absolute 36-month non-cancellable lock-in."
          },
          {
            paraId: "DOC-REPLY-DEMAND:P2",
            paraNum: 2,
            text: "Quantix Cloud demands immediate payment of USD 270,000 representing 18 remaining months of subscription fees under the liquidated damages stipulation of Clause 14.1, threatening litigation within 14 days."
          }
        ]
      }
    ],
    groundTruthFacts: [
      {
        fact: "Clause 4.2 explicitly gives Customer right to terminate at any time with 30 days notice with no penalty.",
        sourceDocId: "DOC-AGREE-SAAS",
        paraId: "DOC-AGREE-SAAS:P2",
        verbatimSpan: "Customer may terminate this Agreement at any time, with or without cause, by giving thirty (30) days prior written notice"
      },
      {
        fact: "Clause 14.1 declares the 36-month term non-cancellable and imposes 100% liquidated damages for remaining term.",
        sourceDocId: "DOC-AGREE-SAAS",
        paraId: "DOC-AGREE-SAAS:P5",
        verbatimSpan: "Customer shall be immediately liable to pay liquidated damages equal to 100% of all unpaid subscription fees"
      },
      {
        fact: "Quantix Cloud demanded USD 270,000 for 18 remaining months citing Clause 14.1.",
        sourceDocId: "DOC-REPLY-DEMAND",
        paraId: "DOC-REPLY-DEMAND:P2",
        verbatimSpan: "Quantix Cloud demands immediate payment of USD 270,000 representing 18 remaining months"
      }
    ],
    knownContradictions: [
      {
        contradictionId: "CONTRA-CONTRACT-001",
        severity: "CRITICAL",
        category: "Direct Contractual Conflict",
        claimA: {
          speaker: "Clause 4.2 (Termination for Convenience)",
          text: "'Notwithstanding anything to the contrary in this Agreement, Customer may terminate... with no additional penalty or forfeiture.'"
        },
        claimB: {
          speaker: "Clause 14.1 (Mandatory Lock-in & Liquidated Damages)",
          text: "'Initial Term is irrevocable and non-cancellable... liable to pay liquidated damages equal to 100% of all unpaid subscription fees.'"
        },
        legalImpact: "Clause 4.2 opens with 'Notwithstanding anything to the contrary', legally overriding Clause 14.1 under the non-obstante doctrine. Furthermore, 100% damages without proof of loss constitutes an unenforceable penalty under Section 74 Contract Act and ONGC v. Saw Pipes (2003) 5 SCC 705 / Kailash Nath (2015) 4 SCC 136."
      },
      {
        contradictionId: "CONTRA-CONTRACT-002",
        severity: "HIGH",
        category: "Liability Conflict",
        claimA: {
          speaker: "Clause 8.1 (Limitation of Liability)",
          text: "Neither party's aggregate cumulative liability shall exceed fees paid in preceding 12 months."
        },
        claimB: {
          speaker: "Clause 9.3 (Customer Indemnification)",
          text: "Customer indemnifies Provider for third-party claims 'without limitation of liability or cap'."
        },
        legalImpact: "Creates severe asymmetrical liability exposure for Customer unless harmonized or explicitly carved out."
      }
    ],
    missingInformation: [
      {
        gapId: "GAP-CONTRACT-001",
        item: "Definitive Governing Law and Exclusive Forum",
        status: "AMBIGUOUS / CONFLICTING",
        ruleRef: "Clause 18.4 cites concurrent jurisdiction of London and Mumbai with dual English/Indian law.",
        recommendation: "Amend to specify single exclusive forum and designate seat of arbitration under Indian Arbitration Act or LCIA Rules."
      },
      {
        gapId: "GAP-CONTRACT-002",
        item: "Service Level Agreement (SLA) & Uptime Credit Mechanism",
        status: "ABSENT",
        ruleRef: "Standard SaaS Industry Framework",
        recommendation: "Contract completely lacks SLA commitments, downtime credits, or support response benchmarks."
      }
    ]
  }
];
