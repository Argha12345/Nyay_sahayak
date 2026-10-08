import { documentStore } from './documentStore.js';

/**
 * Pre-Drafting Confidence & Missing-Information Audit Engine (Stretch Goal 2)
 * Evaluates document sufficiency and statutory compliance BEFORE drafting begins.
 */
export class MissingInfoEngine {
  /**
   * Generate comprehensive Pre-Drafting Audit Report
   */
  generateAuditReport(caseId, draftType = 'bail_application') {
    const targetCase = documentStore.getCaseById(caseId);
    if (!targetCase) {
      return {
        confidenceScore: 50,
        readinessStatus: 'UNKNOWN_CASE',
        missingItems: []
      };
    }

    const docs = targetCase.documents || [];
    const allText = docs.map(d => d.paragraphs.map(p => p.text).join(' ')).join(' ').toLowerCase();

    const missingItems = [];
    let deduction = 0;

    // Check 1: Mandatory Section 41A / 35(3) Notice Compliance (in criminal cases)
    if (targetCase.type?.toLowerCase().includes('criminal') || draftType.includes('bail')) {
      const mentions41A = allText.includes('41a') || allText.includes('section 35');
      const mentionsNoNotice = allText.includes('no notice under section 41a') || allText.includes('no notice') || allText.includes('without warrant');

      if (mentionsNoNotice || !mentions41A) {
        missingItems.push({
          id: 'AUDIT-GAP-001',
          category: 'Statutory Procedure Violation',
          severity: 'HIGH_IMPACT',
          finding: 'Arrest was effected without prior Section 41A CrPC (Section 35(3) BNSS) Notice of Appearance.',
          statutoryRule: 'Arnesh Kumar v. State of Bihar (2014) 8 SCC 273; Satender Kumar Antil (2022) 10 SCC 51',
          litigationAdvantage: 'Direct ground for immediate grant of bail and initiation of departmental proceedings against arresting officer.',
          actionRequired: 'Incorporate Ground (B) in bail application citing non-compliance of mandatory arrest checklist.'
        });
        deduction += 10;
      }

      // Check 2: Electronic Evidence Certificate under S. 65B(4) / S. 63 BSA
      const hasElectronicEvidence = allText.includes('iphone') || allText.includes('whatsapp') || allText.includes('macbook') || allText.includes('server');
      const has65BCertificate = allText.includes('65b certificate executed') || allText.includes('certified under section 65b');

      if (hasElectronicEvidence && !has65BCertificate) {
        missingItems.push({
          id: 'AUDIT-GAP-002',
          category: 'Evidentiary Defect (Admissibility)',
          severity: 'HIGH_IMPACT',
          finding: 'Electronic devices (mobile phone, chats) seized without contemporaneous Section 65B(4) Evidence Act / Section 63 BSA certificate.',
          statutoryRule: 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) 7 SCC 1',
          litigationAdvantage: 'Seized WhatsApp chats and digital records are legally inadmissible against accused at bail or trial.',
          actionRequired: 'Challenge reliance on uncertified digital transcripts in petition pleadings.'
        });
        deduction += 15;
      }

      // Check 3: Independent Recovery Witness (Panchnama)
      const hasIndependentWitness = allText.includes('independent panch') || allText.includes('independent witness');
      if (!hasIndependentWitness) {
        missingItems.push({
          id: 'AUDIT-GAP-003',
          category: 'Procedural Search Defect',
          severity: 'MEDIUM_IMPACT',
          finding: 'Seizure panchnama lacks independent public attesting witnesses (panchas).',
          statutoryRule: 'Section 100(4) CrPC / Section 103 BNSS',
          litigationAdvantage: 'Creates reasonable doubt regarding alleged recovery and tampering.',
          actionRequired: 'Request trial court to summon IO for preliminary verification of seizure log.'
        });
        deduction += 10;
      }
    }

    // Check 4: Commercial Contract Completeness (in contract cases)
    if (targetCase.type?.toLowerCase().includes('contract') || targetCase.type?.toLowerCase().includes('commercial') || draftType.includes('notice')) {
      const mentionsArbitration = allText.includes('arbitration') || allText.includes('dispute resolution');
      const mentionsSeat = allText.includes('seat of arbitration') || allText.includes('exclusive jurisdiction');

      if (mentionsArbitration && !mentionsSeat) {
        missingItems.push({
          id: 'AUDIT-GAP-COMM-01',
          category: 'Jurisdictional Ambiguity',
          severity: 'HIGH_IMPACT',
          finding: 'Dispute clause provides concurrent jurisdiction without specifying an exclusive seat of arbitration.',
          statutoryRule: 'Section 20 Arbitration and Conciliation Act, 1996; BGS SGS Soma JV (2020)',
          litigationAdvantage: 'High risk of forum non conveniens and parallel anti-suit injunctions.',
          actionRequired: 'Draft formal notice preserving right to elect domestic forum under Indian Arbitration Act.'
        });
        deduction += 20;
      }
    }

    // Include pre-curated case missing items
    if (targetCase.missingInformation) {
      for (const item of targetCase.missingInformation) {
        if (!missingItems.some(m => m.id === item.gapId)) {
          missingItems.push({
            id: item.gapId,
            category: 'Evidentiary Defect',
            severity: 'CRITICAL',
            finding: item.item,
            statutoryRule: item.ruleRef,
            litigationAdvantage: 'Factual hole in adversary case.',
            actionRequired: item.recommendation
          });
        }
      }
    }

    // Calculate confidence score (85 - deduction + bonus for available corroboration)
    const baseConfidence = Math.max(45, 95 - (missingItems.length * 8));

    return {
      caseId,
      caseTitle: targetCase.title,
      draftType,
      confidenceScore: baseConfidence,
      readinessLevel: baseConfidence >= 80 ? 'HIGH_CONFIDENCE' : baseConfidence >= 65 ? 'MODERATE_CONFIDENCE' : 'LOW_CONFIDENCE',
      readinessSummary: baseConfidence >= 80 
        ? 'Dossier exhibits strong evidentiary grounds for immediate drafting with high probability of relief.'
        : 'Critical procedural violations identified in prosecution record; recommended to draft with heavy reliance on statutory exceptions.',
      totalGapsIdentified: missingItems.length,
      missingItems,
      auditTimestamp: new Date().toISOString()
    };
  }
}

export const missingInfoEngine = new MissingInfoEngine();
