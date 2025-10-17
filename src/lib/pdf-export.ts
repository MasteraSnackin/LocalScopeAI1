import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (element: HTMLElement, postcode: string) => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfMargin = 40;
  const contentWidth = pdfWidth - pdfMargin * 2;

  // Temporarily clone the element to modify styles for PDF rendering
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${contentWidth}px`;
  clone.style.padding = '0';
  clone.style.margin = '0';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0px';

  document.body.appendChild(clone);

  // Add a header to the PDF
  const addHeader = (pdf: jsPDF) => {
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LocalScope AI Report', pdfWidth / 2, pdfMargin, { align: 'center' });
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(postcode, pdfWidth / 2, pdfMargin + 25, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdfMargin + 40, { align: 'center' });
  };
  
  // Add a footer to each page
  const addFooter = (pdf: jsPDF) => {
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pdfWidth - pdfMargin,
            pdf.internal.pageSize.getHeight() - 15,
            { align: 'right' }
        );
    }
  };


  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: clone.scrollWidth,
    windowHeight: clone.scrollHeight,
  });

  document.body.removeChild(clone);

  const imgData = canvas.toDataURL('image/png');
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
  const pageHeight = pdf.internal.pageSize.getHeight() - (pdfMargin * 2);

  let heightLeft = imgHeight;
  let position = pdfMargin + 50; // Start content after header

  addHeader(pdf);

  pdf.addImage(imgData, 'PNG', pdfMargin, position, contentWidth, imgHeight);
  heightLeft -= (pageHeight - 50);

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + pdfMargin;
    pdf.addPage();
    addHeader(pdf);
    pdf.addImage(imgData, 'PNG', pdfMargin, position, contentWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  addFooter(pdf);
  
  pdf.save(`LocalScope-AI-Report-${postcode}.pdf`);
};
