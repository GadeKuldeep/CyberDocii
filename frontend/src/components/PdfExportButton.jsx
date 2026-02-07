import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import { getSections } from '../api/sectionApi';

const PdfExportButton = ({ projectId, projectTitle, className }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);

        try {
            const { data: sections } = await getSections(projectId);
            const filteredSections = sections.filter(s => s.type !== 'video');

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yOffset = 30;

            // --- Header ---
            doc.setFillColor(0, 0, 0);
            doc.rect(0, 0, pageWidth, 25, 'F');

            doc.setTextColor(0, 191, 255); // Sky Blue
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("CYBERDOCII", margin, 17);

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text("SECURITY PROTOCOL REPORT", pageWidth - margin - 50, 17);

            // --- Title Section ---
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(24);
            doc.text(projectTitle || 'Untitled Mission', margin, yOffset);
            yOffset += 12;

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont("courier", "normal");
            doc.text(`PROJECT_ID: ${projectId}`, margin, yOffset);
            doc.text(`TIMESTAMP: ${new Date().toLocaleString()}`, margin, yOffset + 5);
            yOffset += 20;

            // --- Content ---
            for (const section of filteredSections) {
                // Page overflow check
                if (yOffset > 250) {
                    doc.addPage();
                    yOffset = 20;
                }

                switch (section.type) {
                    case 'text':
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(11);
                        doc.setTextColor(30, 30, 30);
                        const textLines = doc.splitTextToSize(section.content || '', contentWidth);
                        doc.text(textLines, margin, yOffset);
                        yOffset += (textLines.length * 6) + 10;
                        break;

                    case 'command':
                        // Draw a light gray box for code
                        doc.setFillColor(245, 245, 245);
                        doc.rect(margin - 2, yOffset - 5, contentWidth + 4, 10, 'F');
                        doc.setDrawColor(200, 200, 200);
                        doc.rect(margin - 2, yOffset - 5, contentWidth + 4, 10, 'D');

                        doc.setFont("courier", "bold");
                        doc.setFontSize(10);
                        doc.setTextColor(0, 150, 0); // Professional green
                        doc.text(`$ ${section.content}`, margin, yOffset + 1);
                        yOffset += 15;
                        break;

                    case 'output':
                        doc.setFillColor(30, 30, 30);
                        const outLines = doc.splitTextToSize(section.content || '', contentWidth - 4);
                        const boxHeight = (outLines.length * 5) + 6;

                        doc.rect(margin - 2, yOffset - 5, contentWidth + 4, boxHeight, 'F');

                        doc.setFont("courier", "normal");
                        doc.setFontSize(9);
                        doc.setTextColor(255, 255, 255);
                        doc.text(outLines, margin, yOffset);
                        yOffset += boxHeight + 10;
                        break;

                    case 'error':
                        doc.setFillColor(255, 235, 235);
                        const errLines = doc.splitTextToSize(`[!] ERROR: ${section.content}`, contentWidth - 4);
                        const errBoxHeight = (errLines.length * 5) + 6;

                        doc.rect(margin - 2, yOffset - 5, contentWidth + 4, errBoxHeight, 'F');
                        doc.setDrawColor(255, 0, 0);
                        doc.rect(margin - 2, yOffset - 5, contentWidth + 4, errBoxHeight, 'D');

                        doc.setFont("courier", "bold");
                        doc.setFontSize(10);
                        doc.setTextColor(200, 0, 0);
                        doc.text(errLines, margin, yOffset);
                        yOffset += errBoxHeight + 10;
                        break;

                    case 'image':
                        if (section.content) {
                            // Since we can't easily wait for images to load in this simple loop
                            // without making it complex, we'll add a label.
                            // In a real app, you'd fetch the image data as base64 first.
                            doc.setFont("helvetica", "italic");
                            doc.setFontSize(9);
                            doc.setTextColor(0, 114, 178);
                            doc.text(`[ATTACHED_IMAGE: ${section.content.substring(0, 30)}...]`, margin, yOffset);
                            yOffset += 10;
                        }
                        break;
                }
            }

            // --- Footer ---
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
                doc.text("CONFIDENTIAL - CYBERDOCII SYSTEMS", margin, 285);
            }

            doc.save(`${projectTitle.replace(/\s+/g, '_')}_Report.pdf`);
        } catch (error) {
            console.error("PDF Export failed", error);
            alert("Export Error. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={className || "pdf-download-btn"}
        >
            <FaDownload />
            <span>{loading ? ' EXPORTING...' : ' PDF'}</span>
        </button>
    );
};

export default PdfExportButton;
