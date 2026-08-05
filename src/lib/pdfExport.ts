import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DecisionSignalExtended, AuditReportEntry, DecisionSignalSummary, Proof, User } from '../types';
import { computeProofHash } from '../services/verificationService';

/**
 * PDF Export Utility for Work Proof OS
 */
export class PDFExportService {
  /**
   * Generates a single official Proof Certificate PDF
   */
  public exportProofPDF(proof: Proof, userName?: string) {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString('fr-FR');
    const hash = proof.hash || computeProofHash(proof);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('WORK PROOF OS', 105, 18, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('CERTIFICAT DE PREUVE PROFESSIONNELLE', 105, 26, { align: 'center' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 32, 196, 32);

    // Document Meta Box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 36, 182, 24, 'F');
    doc.rect(14, 36, 182, 24, 'S');

    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`TITULAIRE : ${userName || 'Professionnel'}`, 20, 44);
    doc.text(`RÉFÉRENCE PREUVE : #${proof.id.substring(0, 12).toUpperCase()}`, 120, 44);
    doc.text(`DATE D'ÉMISSION : ${timestamp}`, 20, 53);
    doc.text(`STATUT : ${(proof.status || 'preuve_declaree').toUpperCase()}`, 120, 53);

    // Title Section
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(proof.title || 'Preuve de Contribution', 14, 70);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(proof.description || '', 180);
    doc.text(splitDesc, 14, 78);

    let currentY = 78 + (splitDesc.length * 5) + 6;

    // STAR Breakdown Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('STRUCTURE STAR & CAUSALITÉ', 14, currentY);

    currentY += 6;

    const starData = [
      ['SITUATION (AVANT)', proof.before || 'Non spécifié'],
      ['ACTION CONCRÈTE', proof.action || 'Non spécifiée'],
      ['RÉSULTAT MESURABLE', proof.result || 'Non spécifié'],
      ['LIEN CAUSAL', proof.causality || 'Non spécifié']
    ];

    (doc as any).autoTable({
      startY: currentY,
      head: [['Étape', 'Contenu Détaillé']],
      body: starData,
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' }, 1: { cellWidth: 130 } },
      theme: 'grid'
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;

    // Verification & Trust Indicators
    doc.setFillColor(240, 253, 244); // Light green
    doc.setDrawColor(187, 247, 208);
    doc.rect(14, currentY, 182, 28, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52); // Emerald
    doc.text(`CONFORT DE PREUVE : ${proof.confidenceScore || 85}%`, 20, currentY + 9);
    doc.text(`IMPACT CONSTATÉ : ${(proof.strength || 'moyenne').toUpperCase()}`, 110, currentY + 9);

    if (proof.verifierId) {
      doc.setFontSize(8);
      doc.text(`VALIDÉ PAR : ${proof.verifierId} | COMMENTAIRE: ${proof.verificationComment || 'Aucun'}`, 20, currentY + 18);
    } else {
      doc.setFontSize(8);
      doc.text('SCELLÉ DE CONFIANCE : Enregistré au registre transactionnel Work Proof OS', 20, currentY + 18);
    }

    currentY += 36;

    // Cryptographic Anchor Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, 196, currentY);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('ANCRAGE CRYPTOGRAPHIQUE SOUVERAIN', 14, currentY + 6);
    doc.setFont(undefined, 'bold');
    doc.text(`HASH : ${hash}`, 14, currentY + 12);
    doc.setFont(undefined, 'normal');
    doc.text(`Vérification publique : ${window.location.origin}/proof/${proof.id}`, 14, currentY + 18);

    doc.save(`Proof_Certificate_${proof.id.substring(0, 8)}_${Date.now()}.pdf`);
  }

  /**
   * Generates a full Proof Ledger (Passport) PDF
   */
  public exportProofLedgerPDF(user: User, proofs: Proof[]) {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString('fr-FR');

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('WORK PROOF OS', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('PASSEPORT & REGISTRE COMPLET DES PREUVES', 105, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`TITULAIRE : ${user.name.toUpperCase()} (${user.role})`, 105, 36, { align: 'center' });
    doc.text(`GÉNÉRÉ LE : ${timestamp} | TOTAL PREUVES : ${proofs.length}`, 105, 43, { align: 'center' });

    const tableData = proofs.map((p, idx) => [
      `#${idx + 1}`,
      p.title || p.action || 'Preuve',
      p.type || 'work_proof',
      p.status || 'preuve_declaree',
      `${p.confidenceScore || 0}%`,
      p.date ? new Date(p.date).toLocaleDateString('fr-FR') : 'N/A',
      p.hash ? p.hash.substring(0, 14) + '...' : 'WPOS-ANCHOR'
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['N°', 'Titre de la Preuve', 'Type', 'Statut', 'Confiance', 'Date', 'Hash Ancrage']],
      body: tableData,
      headStyles: { fillColor: [37, 99, 235] },
      theme: 'striped'
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Ce document est un extrait certifié conforme du registre transactionnel Work Proof OS.', 14, finalY);
    doc.text('Toutes les preuves sont soumises à la souveraineté de l\'utilisateur et vérifiables en ligne.', 14, finalY + 6);

    doc.save(`Proof_Passport_${user.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  }

  /**
   * Generates a PDF report for Signal Audit Engine (SAE)
   */
  public exportAuditReport(entries: AuditReportEntry[], stats: any, tenantName?: string) {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Success Emerald
    doc.text('WORK PROOF OS', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text('SIGNAL AUDIT ENGINE - RAPPORT DE CONFORMITÉ', 105, 30, { align: 'center' });
    
    if (tenantName) {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`ORGANISATION : ${tenantName.toUpperCase()}`, 105, 38, { align: 'center' });
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Généré le : ${timestamp}`, 105, tenantName ? 45 : 38, { align: 'center' });

    // Stats Summary
    const statsY = tenantName ? 52 : 45;
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, statsY, 182, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('RÉSUMÉ STATISTIQUE', 20, statsY + 10);
    
    doc.setFontSize(10);
    doc.text(`Total Audits : ${stats.total}`, 20, statsY + 20);
    doc.text(`Taux de Conformité : ${stats.complianceRate}%`, 80, statsY + 20);
    doc.text(`Anomalies Détectées : ${stats.anomalyCount}`, 140, statsY + 20);

    // Table
    const tableData = entries.map(e => [
      new Date(e.timestamp).toLocaleTimeString(),
      e.networkId,
      e.severityCheck ? 'OK' : 'FAIL',
      e.confidenceCheck ? 'OK' : 'FAIL',
      e.recommendedActionCheck ? 'OK' : 'FAIL',
      e.anomalies?.join(', ') || 'Aucune'
    ]);

    (doc as any).autoTable({
      startY: statsY + 40,
      head: [['Heure', 'Réseau', 'Sévérité', 'Confiance', 'Action', 'Anomalies']],
      body: tableData,
      headStyles: { fillStyle: 'f', fillColor: [16, 185, 129] },
      theme: 'striped'
    });

    doc.save(`Audit_Report_${tenantName || 'Global'}_${Date.now()}.pdf`);
  }

  /**
   * Generates a PDF report for Advanced Insights (ADSE)
   */
  public exportInsightsReport(summaries: DecisionSignalSummary[], tenantName?: string) {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Primary Blue
    doc.text('WORK PROOF OS', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text('ADVANCED INSIGHTS - RAPPORT STRATÉGIQUE', 105, 30, { align: 'center' });
    
    if (tenantName) {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`ORGANISATION : ${tenantName.toUpperCase()}`, 105, 38, { align: 'center' });
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Généré le : ${timestamp}`, 105, tenantName ? 45 : 38, { align: 'center' });

    // Content
    let yPos = tenantName ? 55 : 50;
    summaries.forEach((s, idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setDrawColor(226, 232, 240);
      doc.rect(14, yPos, 182, 45);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${s.networkName} (${s.networkId})`, 20, yPos + 10);

      doc.setFontSize(10);
      doc.setTextColor(s.avgSeverity === 'CRITICAL' ? 239 : 100, s.avgSeverity === 'CRITICAL' ? 68 : 116, s.avgSeverity === 'CRITICAL' ? 68 : 139);
      doc.text(`Sévérité : ${s.avgSeverity}`, 20, yPos + 20);
      doc.text(`Confiance : ${(s.avgConfidence * 100).toFixed(0)}%`, 80, yPos + 20);
      doc.text(`Drivers : ${s.topDrivers.join(', ')}`, 140, yPos + 20);

      doc.setTextColor(15, 23, 42);
      doc.setFont(undefined, 'italic');
      const splitText = doc.splitTextToSize(`"${s.narrativeSummary}"`, 170);
      doc.text(splitText, 20, yPos + 30);
      doc.setFont(undefined, 'normal');

      yPos += 55;
    });

    doc.save(`Insights_Report_${Date.now()}.pdf`);
  }
}

export const pdfExportService = new PDFExportService();

