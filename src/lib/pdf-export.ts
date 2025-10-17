import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportData } from './types';
import { Logo } from '@/components/icons/logo';

// This is a simplified version. A real implementation would need more robust styling and element handling.
export const exportToPdf = async (reportData: ReportData, postcode: string) => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfMargin = 20;

  // Create a hidden element to render for PDF generation
  const reportElement = document.createElement('div');
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.style.width = `${pdfWidth - pdfMargin * 2}px`;
  reportElement.style.fontFamily = 'Helvetica, Arial, sans-serif';
  reportElement.style.color = '#000';

  let contentHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">LocalScope AI Report</h1>
      <h2 style="font-size: 18px; font-weight: normal; color: #555;">${postcode}</h2>
      <p style="font-size: 10px; color: #888;">Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Executive Summary</h3>
      <p style="font-size: 12px; line-height: 1.6;">${reportData.executiveSummary.replace(/\n/g, '<br/>')}</p>
    </div>
  `;

  reportData.reportSections.forEach(section => {
    contentHTML += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">${section.title}</h3>
        <p style="font-size: 12px; line-height: 1.6;">${section.content.replace(/\n/g, '<br/>')}</p>
      </div>
    `;
  });

  if (reportData.citations && reportData.citations.length > 0) {
    contentHTML += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Citations</h3>
        <ul style="font-size: 10px; line-height: 1.6; padding-left: 20px;">
          ${reportData.citations.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  reportElement.innerHTML = contentHTML;
  document.body.appendChild(reportElement);

  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
  });

  document.body.removeChild(reportElement);
  
  const imgData = canvas.toDataURL('image/png');
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * (pdfWidth - pdfMargin * 2)) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'PNG', pdfMargin, pdfMargin, pdfWidth - pdfMargin * 2, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', pdfMargin, position - pdfMargin, pdfWidth - pdfMargin * 2, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(`LocalScope-AI-Report-${postcode}.pdf`);
};
