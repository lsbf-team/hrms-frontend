import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User } from '@/contexts/AuthContext';

export const generatePayslip = (user: User, slip: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header Color Bar
    doc.setFillColor(30, 41, 59); // Dark blue/slate color
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title / Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('HRMS', 15, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Payslip Document', 15, 30);

    // Payslip Month/Year (Right Side)
    doc.setFontSize(14);
    doc.text(slip.month, pageWidth - 15, 25, { align: 'right' });

    // Reset Text Color
    doc.setTextColor(0, 0, 0);

    // Employee Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Details', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left Column
    doc.text(`Name: ${user.name}`, 15, 65);
    doc.text(`Employee ID: ${user.employeeId}`, 15, 72);
    doc.text(`Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`, 15, 79);

    // Right Column
    doc.text(`Email: ${user.email}`, pageWidth / 2 + 10, 65);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, pageWidth / 2 + 10, 72);

    // Line Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 85, pageWidth - 15, 85);

    // Salary Breakdown Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Salary Breakdown', 15, 100);

    const basicSalary = Number(slip.basicSalary) || 0;
    const allowances = Number(slip.allowances) || 0;
    const deductions = Number(slip.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;

    const tableData = [
        ['Basic Salary', `$${basicSalary.toLocaleString()}`],
        ['Allowances', `+$${allowances.toLocaleString()}`],
        ['Deductions', `-$${deductions.toLocaleString()}`],
    ];

    autoTable(doc, {
        startY: 110,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 50, halign: 'right' }
        },
    });

    // Net Salary Section (Below Table)
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFillColor(240, 240, 240);
    doc.rect(pageWidth - 80, finalY - 10, 65, 20, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Net Salary:', pageWidth - 75, finalY + 4);

    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text(`$${netSalary.toLocaleString()}`, pageWidth - 20, finalY + 4, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated document and does not require a signature.', pageWidth / 2, 280, { align: 'center' });

    // Save
    doc.save(`Payslip_${user.employeeId}_${slip.month.replace(' ', '_')}.pdf`);
};
