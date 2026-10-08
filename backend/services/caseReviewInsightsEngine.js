import { documentStore } from './documentStore.js';

/**
 * Case Review Insights Engine:
 * Generates Chronological Event Timelines, Defense Cross-Examination Strategy Questions,
 * and Side-by-Side Document Diff Pairs.
 */
export class CaseReviewInsightsEngine {
  /**
   * Build complete insights payload for a given case
   */
  generateInsights(caseId) {
    const targetCase = documentStore.getCaseById(caseId);
    if (!targetCase) {
      return {
        timeline: [],
        crossExaminationQuestions: [],
        diffPairs: []
      };
    }

    const timeline = this.buildTimeline(targetCase);
    const crossExaminationQuestions = this.buildCrossExaminationQuestions(targetCase);
    const diffPairs = this.buildDiffPairs(targetCase);

    return {
      caseId: targetCase.id,
      timeline,
      crossExaminationQuestions,
      diffPairs
    };
  }

  buildTimeline(caseData) {
    if (caseData.id === 'CASE-CRIM-001') {
      return [
        {
          id: 'TIME-01',
          date: '2024-10-11',
          time: '08:15 IST',
          title: 'Accused Departs for Singapore',
          location: 'Kempegowda Int. Airport (BLR)',
          category: 'Alibi Verification',
          status: 'VERIFIED',
          sourceDoc: 'DOC-ALIBI-IMMIGRATION:P2',
          summary: 'Subject Vikramaditya Sen departed India on Singapore Airlines flight SQ-503.',
          isClash: false
        },
        {
          id: 'TIME-02',
          date: '2024-10-11',
          time: '16:45 SGT',
          title: 'Hotel Check-In in Singapore',
          location: 'Marina Bay Sands, Singapore',
          category: 'Alibi Verification',
          status: 'VERIFIED',
          sourceDoc: 'DOC-ALIBI-IMMIGRATION:P3',
          summary: 'Subject checked into Marina Bay Sands and registered for APAC FinTech Summit.',
          isClash: false
        },
        {
          id: 'TIME-03',
          date: '2024-10-12',
          time: '14:00 - 18:00 SGT',
          title: 'Accused Speaker at FinTech Summit',
          location: 'Sands Expo, Singapore',
          category: 'Alibi Verification',
          status: 'VERIFIED',
          sourceDoc: 'DOC-ALIBI-IMMIGRATION:P3',
          summary: 'Subject was physically on stage at conference in Singapore (11:30 - 15:30 IST).',
          isClash: false
        },
        {
          id: 'TIME-04',
          date: '2024-10-12',
          time: '16:30 IST',
          title: 'Alleged In-Person Cash Handover (Complainant Claim)',
          location: 'Starbucks Indiranagar, Bengaluru',
          category: 'Alleged Offence',
          status: 'CONTRADICTED',
          sourceDoc: 'DOC-WIT-KHURANA:P4',
          summary: 'Complainant Rajesh Khurana claims he handed INR 25,00,000 in cash to the accused.',
          isClash: true,
          clashDetails: 'Direct geographical impossibility: Accused was 3,000+ km away in Singapore.'
        },
        {
          id: 'TIME-05',
          date: '2024-10-16',
          time: '23:40 IST',
          title: 'Accused Returns to India',
          location: 'BLR Airport, Bengaluru',
          category: 'Travel Record',
          status: 'VERIFIED',
          sourceDoc: 'DOC-ALIBI-IMMIGRATION:P4',
          summary: 'Subject returns to India aboard SQ-502 after summit completion.',
          isClash: false
        },
        {
          id: 'TIME-06',
          date: '2024-10-24',
          time: '14:15 IST',
          title: 'First Information Report (FIR 182/2024)',
          location: 'Cyber Crime PS, Bengaluru',
          category: 'Police Action',
          status: 'PROCEDURAL',
          sourceDoc: 'DOC-FIR-182:P1',
          summary: 'FIR registered under Section 420 & 406 IPC (Sections 318(4) and 316 BNS).',
          isClash: false
        },
        {
          id: 'TIME-07',
          date: '2024-11-14',
          time: '09:30 IST',
          title: 'Arrest Without S. 41A Notice',
          location: 'Prestige Palms, Bengaluru',
          category: 'Statutory Violation',
          status: 'PROCEDURAL_DEFECT',
          sourceDoc: 'DOC-ARREST-MEMO:P2',
          summary: 'Accused arrested without prior Section 41A CrPC notice and uncertified digital seizure.',
          isClash: true,
          clashDetails: 'Violates mandatory Supreme Court arrest directives (Arnesh Kumar / Satender Antil).'
        }
      ];
    }

    if (caseData.id === 'CASE-COMM-002') {
      return [
        {
          id: 'TIME-COMM-01',
          date: '2023-04-15',
          time: '11:00 IST',
          title: 'Execution of Master SaaS Agreement',
          location: 'New York / Mumbai',
          category: 'Contract Execution',
          status: 'VERIFIED',
          sourceDoc: 'DOC-AGREE-SAAS:P1',
          summary: 'Apex Solutions and Quantix Cloud enter 36-month cloud agreement.',
          isClash: false
        },
        {
          id: 'TIME-COMM-02',
          date: '2024-09-10',
          time: '15:30 IST',
          title: 'Termination for Convenience Exercised',
          location: 'Apex Corporate Office',
          category: 'Contractual Notice',
          status: 'VERIFIED',
          sourceDoc: 'DOC-NOTICE-DISPUTE:P1',
          summary: 'Apex serves formal 30 days notice under non-obstante Clause 4.2.',
          isClash: false
        },
        {
          id: 'TIME-COMM-03',
          date: '2024-09-22',
          time: '17:00 IST',
          title: 'Quantix Counter-Demand for USD 270,000',
          location: 'Quantix Legal Dept',
          category: 'Dispute / Penalty Demand',
          status: 'CONTRADICTED',
          sourceDoc: 'DOC-REPLY-DEMAND:P1',
          summary: 'Quantix demands 100% of remaining term fees under Clause 14.1.',
          isClash: true,
          clashDetails: 'Direct clash with Clause 4.2 non-obstante terms and S. 74 Contract Act.'
        },
        {
          id: 'TIME-COMM-04',
          date: '2024-10-10',
          time: '18:00 IST',
          title: 'Effective Termination & Final Payment',
          location: 'Banking Channels',
          category: 'Payment Compliance',
          status: 'VERIFIED',
          sourceDoc: 'DOC-NOTICE-DISPUTE:P2',
          summary: 'Apex tenders USD 15,000 payment for all services utilized up to termination date.',
          isClash: false
        }
      ];
    }

    // Dynamic timeline for custom uploaded cases
    const timeline = [];
    const docs = caseData.documents || [];
    let count = 1;

    for (const doc of docs) {
      for (const p of doc.paragraphs || []) {
        // Match dates like 2024-10-12, 12th October 2024, 12/10/2024
        const dateMatch = p.text.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{4})\b/i);
        if (dateMatch) {
          timeline.push({
            id: `TIME-DYN-${count}`,
            date: dateMatch[0],
            time: 'Recorded in Filing',
            title: `Event in ${doc.title}`,
            location: 'Case Record',
            category: doc.type,
            status: 'VERIFIED',
            sourceDoc: p.paraId,
            summary: p.text.length > 130 ? p.text.substring(0, 127) + '...' : p.text,
            isClash: p.text.toLowerCase().includes('contradict') || p.text.toLowerCase().includes('dispute') || p.text.toLowerCase().includes('failed')
          });
          count++;
          if (timeline.length >= 7) break;
        }
      }
      if (timeline.length >= 7) break;
    }

    return timeline;
  }

  buildCrossExaminationQuestions(caseData) {
    if (caseData.id === 'CASE-CRIM-001') {
      return [
        {
          id: 'CROSS-01',
          witnessType: 'Complainant (Rajesh Khurana)',
          question: 'In your Section 161 CrPC statement, you swore on oath that on 12th October 2024 at 16:30 hrs, you met Vikramaditya Sen at Starbucks in Indiranagar, Bengaluru and handed him INR 25 Lakhs cash in a briefcase. Isn’t that correct?',
          objective: 'Pin down the complainant to the exact date, time, and physical delivery venue.',
          evidentiaryTrap: 'Once affirmed, confront the witness with Bureau of Immigration records (SQ-503) proving accused was in Singapore from 11-Oct to 16-Oct.',
          sourceDocRef: 'DOC-WIT-KHURANA:P4',
          impeachmentEvidence: 'DOC-ALIBI-IMMIGRATION:P2 & P5',
          statutorySection: 'Section 145 & 155 Indian Evidence Act / Section 148 BSA (Impeaching credit of witness)'
        },
        {
          id: 'CROSS-02',
          witnessType: 'Investigating Officer (Inspector K.N. Gowda)',
          question: 'Inspector, in your Arrest Memo dated 14th November 2024, you acknowledged that zero notice under Section 41A CrPC (Section 35(3) BNSS) was issued to the accused prior to his arrest. Did you record any reasons in writing explaining why immediate arrest was indispensable?',
          objective: 'Establish willful defiance of mandatory statutory pre-arrest procedure.',
          evidentiaryTrap: 'Forces the IO to concede breach of binding Supreme Court directions in Arnesh Kumar (2014) 8 SCC 273 and Satender Antil (2022) 10 SCC 51.',
          sourceDocRef: 'DOC-ARREST-MEMO:P2',
          impeachmentEvidence: 'PREC-SC-2014-ARNESH',
          statutorySection: 'Section 35(3) BNSS / Section 41A CrPC'
        },
        {
          id: 'CROSS-03',
          witnessType: 'Investigating Officer / Forensic Officer',
          question: 'When you seized the accused’s Apple iPhone 15 Pro and exported screenshots of WhatsApp messages, did you contemporaneously execute and file a certificate under Section 65B(4) Evidence Act / Section 63 BSA?',
          objective: 'Exclude the entire electronic record and chat transcript from judicial consideration.',
          evidentiaryTrap: 'The Arrest Memo explicitly concedes no 65B certificate was executed. Under Arjun Panditrao Khotkar (2020) 7 SCC 1, uncertified digital evidence is completely inadmissible.',
          sourceDocRef: 'DOC-ARREST-MEMO:P4',
          impeachmentEvidence: 'PREC-SC-2020-KHOTKAR',
          statutorySection: 'Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B IEA'
        },
        {
          id: 'CROSS-04',
          witnessType: 'Bank Officer / Auditor (Axis Bank)',
          question: 'According to your institutional compliance audit, out of the INR 20 Lakhs received through banking channels, was INR 18.5 Lakhs legitimately routed to institutional cryptocurrency exchanges for market hedging, with zero cash deposit of INR 25 Lakhs found in any account?',
          objective: 'Demolish the allegation of dishonest criminal misappropriation and prove legitimate commercial venture.',
          evidentiaryTrap: 'Audit confirms zero cash deposit and legitimate commercial routing, converting criminal cheating into an ordinary commercial risk dispute.',
          sourceDocRef: 'DOC-BANK-AXIS:P3 & P4',
          impeachmentEvidence: 'DOC-BANK-AXIS:P4',
          statutorySection: 'Section 405 IPC (Criminal Breach of Trust requires dishonest conversion)'
        }
      ];
    }

    if (caseData.id === 'CASE-COMM-002') {
      return [
        {
          id: 'CROSS-COMM-01',
          witnessType: 'Corporate Witness (Quantix Cloud Inc.)',
          question: 'Does Clause 4.2 of the Master SaaS Agreement explicitly start with the words: “Notwithstanding anything to the contrary in this Agreement, Customer may terminate this Agreement at any time, with or without cause, by giving thirty (30) days prior written notice to Provider... with no additional penalty or forfeiture”?',
          objective: 'Establish that the non-obstante right of termination for convenience explicitly overrides Clause 14.1.',
          evidentiaryTrap: 'The plain contractual text prevents Quantix from claiming that Clause 14.1 restricts early exit.',
          sourceDocRef: 'DOC-AGREE-SAAS:P2',
          impeachmentEvidence: 'DOC-NOTICE-DISPUTE:P1',
          statutorySection: 'Section 91 & 92 Indian Evidence Act / Section 94 & 95 BSA (Exclusion of oral evidence)'
        },
        {
          id: 'CROSS-COMM-02',
          witnessType: 'Financial Controller (Quantix Cloud Inc.)',
          question: 'Has Quantix Cloud incurred any proven actual damages of USD 270,000, or does this figure solely represent 100% of future unearned revenue for 18 months where zero cloud servers were subsequently provisioned?',
          objective: 'Classify the claim as an illegal in terrorem penalty prohibited under Section 74 Contract Act.',
          evidentiaryTrap: 'Under ONGC v. Saw Pipes Ltd. (2003) 5 SCC 705 and Kailash Nath Associates (2015) 4 SCC 136, 100% unearned revenue cannot be recovered without proof of actual loss.',
          sourceDocRef: 'DOC-REPLY-DEMAND:P1',
          impeachmentEvidence: 'STAT-CONTRACT-74',
          statutorySection: 'Section 74 Indian Contract Act, 1872'
        }
      ];
    }

    // Dynamic Cross-examination questions for custom dossiers
    const contradictions = caseData.knownContradictions || [];
    const questions = [];

    contradictions.forEach((c, idx) => {
      questions.push({
        id: `CROSS-DYN-${idx + 1}`,
        witnessType: c.claimA?.speaker || 'Adverse Witness',
        question: `You asserted that: "${c.claimA?.text}". How do you reconcile this assertion with the documented record stating: "${c.claimB?.text}"?`,
        objective: `Impeach witness credibility on ${c.category}.`,
        evidentiaryTrap: `Exposes direct contradiction against ${c.claimB?.speaker}.`,
        sourceDocRef: c.contradictionId || `CONFLICT-${idx + 1}`,
        impeachmentEvidence: c.claimB?.speaker || 'Contradictory record',
        statutorySection: 'Section 148 BSA / Section 155 Evidence Act (Impeaching witness credit)'
      });
    });

    if (questions.length === 0) {
      questions.push({
        id: 'CROSS-DYN-01',
        witnessType: 'Opposing Deponent',
        question: `Can you produce any contemporaneous primary document to substantiate the claim asserted in paragraph 1 of the filing?`,
        objective: 'Test documentary provenance and foundation.',
        evidentiaryTrap: 'Tests compliance with the best evidence rule.',
        sourceDocRef: `${caseData.id}:P1`,
        impeachmentEvidence: 'Case Record Offsets',
        statutorySection: 'Section 61 & 64 Indian Evidence Act'
      });
    }

    return questions;
  }

  buildDiffPairs(caseData) {
    if (caseData.id === 'CASE-CRIM-001') {
      return [
        {
          id: 'DIFF-01',
          title: 'Cash Handover Allegation vs. Bureau of Immigration Alibi Record',
          category: 'Physical Alibi Contradiction',
          severity: 'CRITICAL',
          leftDoc: {
            title: 'Statement of Complainant Rajesh Khurana (S. 161 CrPC)',
            paraId: 'DOC-WIT-KHURANA:P4',
            date: '28-Oct-2024',
            text: 'I personally met Vikramaditya Sen on 12th October 2024 at 16:30 hrs at Starbucks, Indiranagar, Bengaluru. I handed over INR 25,00,000 in cash packed in a black leather briefcase. He promised allocation of crypto fund units within 48 hours.',
            highlightSpan: '12th October 2024 at 16:30 hrs at Starbucks, Indiranagar, Bengaluru... handed over INR 25,00,000 in cash'
          },
          rightDoc: {
            title: 'Bureau of Immigration Travel Manifest (SQ-503)',
            paraId: 'DOC-ALIBI-IMMIGRATION:P2 & P5',
            date: '08-Nov-2024',
            text: 'Departure Record: Subject departed India from Kempegowda Airport, BLR on 11th October 2024 at 08:15 hrs aboard SQ-503. On 12th October 2024 at 16:30 hrs IST, subject was physically in the Republic of Singapore at the APAC FinTech Summit (Marina Bay Sands).',
            highlightSpan: 'departed India on 11th October 2024... physically in the Republic of Singapore'
          },
          discrepancyAnalysis: 'Irreconcilable physical impossibility. Accused was geographically in Singapore, 3,000+ km away from Bengaluru, rendering the complainant’s claim of in-person cash handover provably false.'
        },
        {
          id: 'DIFF-02',
          title: 'Alleged INR 45 Lakh Siphoning vs. Axis Bank Financial Audit',
          category: 'Financial Discrepancy',
          severity: 'HIGH',
          leftDoc: {
            title: 'FIR No. 182/2024 Allegations',
            paraId: 'DOC-FIR-182:P4',
            date: '24-Oct-2024',
            text: 'The complainant alleges that INR 20,00,000 was transferred via NEFT/RTGS to HDFC Bank, and remaining INR 25,00,000 was delivered in cash in person to accused on 12th October 2024, resulting in complete misappropriation of INR 45 Lakhs.',
            highlightSpan: 'remaining INR 25,00,000 was delivered in cash... complete misappropriation'
          },
          rightDoc: {
            title: 'Axis Bank Forensic & Ledger Compliance Audit',
            paraId: 'DOC-BANK-AXIS:P3 & P4',
            date: '05-Nov-2024',
            text: 'Audit confirms INR 18,50,000 was legitimately deployed via institutional API to WazirX and CoinDCX hedging accounts. Furthermore, there is zero record of any cash deposit of INR 25,00,000 into any accounts of the accused or LLP.',
            highlightSpan: 'zero record of any cash deposit of INR 25,00,000... legitimately deployed via institutional API'
          },
          discrepancyAnalysis: 'Banking ledger negates the alleged cash receipt and demonstrates legitimate algorithmic exchange deployment rather than personal conversion.'
        }
      ];
    }

    if (caseData.id === 'CASE-COMM-002') {
      return [
        {
          id: 'DIFF-COMM-01',
          title: 'Clause 4.2 (Termination for Convenience) vs. Clause 14.1 (Liquidated Damages Lock-in)',
          category: 'Contractual Clause Clash',
          severity: 'CRITICAL',
          leftDoc: {
            title: 'Master SaaS Agreement: Clause 4.2',
            paraId: 'DOC-AGREE-SAAS:P2',
            date: '15-Apr-2023',
            text: 'Notwithstanding anything to the contrary in this Agreement, Customer may terminate this Agreement at any time, with or without cause, by giving thirty (30) days prior written notice to Provider... with no additional penalty or forfeiture.',
            highlightSpan: 'Notwithstanding anything to the contrary... with no additional penalty or forfeiture'
          },
          rightDoc: {
            title: 'Master SaaS Agreement: Clause 14.1 & Demand Notice',
            paraId: 'DOC-AGREE-SAAS:P5',
            date: '15-Apr-2023',
            text: 'In the event of early termination by Customer prior to expiry of the 36-month Term, Customer shall immediately pay to Provider 100% of the recurring fees for all remaining months of the Term as pre-agreed liquidated damages.',
            highlightSpan: 'Customer shall immediately pay to Provider 100% of the recurring fees for all remaining months'
          },
          discrepancyAnalysis: 'Clause 4.2 contains a non-obstante supremacy clause that legally overrides Clause 14.1. Furthermore, demanding 100% unearned future fees is an illegal penalty under Section 74 of the Indian Contract Act.'
        }
      ];
    }

    // Dynamic diff pairs for custom cases
    const diffPairs = [];
    const contradictions = caseData.knownContradictions || [];
    contradictions.forEach((c, idx) => {
      diffPairs.push({
        id: `DIFF-DYN-${idx + 1}`,
        title: `${c.category}: ${c.claimA?.speaker} vs ${c.claimB?.speaker}`,
        category: c.category,
        severity: c.severity,
        leftDoc: {
          title: c.claimA?.speaker || 'Claim A Document',
          paraId: `DOC-A:${idx + 1}`,
          date: 'Filing Record',
          text: c.claimA?.text || '',
          highlightSpan: (c.claimA?.text || '').substring(0, 80)
        },
        rightDoc: {
          title: c.claimB?.speaker || 'Claim B Document',
          paraId: `DOC-B:${idx + 1}`,
          date: 'Filing Record',
          text: c.claimB?.text || '',
          highlightSpan: (c.claimB?.text || '').substring(0, 80)
        },
        discrepancyAnalysis: c.legalImpact || 'Direct discrepancy between two statements in the case files.'
      });
    });

    return diffPairs;
  }
}

export const caseReviewInsightsEngine = new CaseReviewInsightsEngine();
