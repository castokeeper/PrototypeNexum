import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Exporta solicitudes a PDF con formato profesional
 * @param {Array} solicitudes - Array de solicitudes a exportar
 * @param {Object} estadisticas - Estadísticas calculadas
 * @param {Object} filtros - Filtros aplicados (opcional)
 */
export const exportarSolicitudesPDF = (solicitudes, estadisticas, filtros = {}) => {
    // Crear documento PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Configuración de colores
    const primaryColor = [37, 99, 235]; // Blue
    const successColor = [16, 185, 129]; // Green
    const dangerColor = [239, 68, 68]; // Red
    const warningColor = [245, 158, 11]; // Orange

    // ============ ENCABEZADO ============
    // Logo/Título
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Sistema Nexum', 14, 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Solicitudes de Admisión', 14, 28);

    // Fecha de generación
    doc.setFontSize(10);
    const fecha = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(`Generado: ${fecha}`, pageWidth - 14, 18, { align: 'right' });

    // ============ ESTADÍSTICAS ============
    let yPos = 50;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);

    yPos += 10;

    // Cuadros de estadísticas
    const statsBoxWidth = (pageWidth - 35) / 4;
    const statsBoxHeight = 25;
    const stats = [
        { label: 'Total', value: estadisticas.total, color: primaryColor },
        { label: 'Pendientes', value: estadisticas.pendientes, color: warningColor },
        { label: 'Aprobadas', value: estadisticas.aprobadas, color: successColor },
        { label: 'Rechazadas', value: estadisticas.rechazadas, color: dangerColor }
    ];

    stats.forEach((stat, index) => {
        const xPos = 14 + (statsBoxWidth + 5) * index;

        // Fondo del cuadro
        doc.setFillColor(...stat.color);
        doc.roundedRect(xPos, yPos, statsBoxWidth, statsBoxHeight, 3, 3, 'F');

        // Texto
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(stat.label, xPos + statsBoxWidth / 2, yPos + 8, { align: 'center' });

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value.toString(), xPos + statsBoxWidth / 2, yPos + 18, { align: 'center' });
    });

    yPos += statsBoxHeight + 15;

    // Métricas adicionales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tasa de Aprobación: ${estadisticas.tasaAprobacion}%`, 14, yPos);
    doc.text(`Nuevo Ingreso: ${estadisticas.nuevoIngreso}`, pageWidth / 2, yPos);
    doc.text(`Reinscripciones: ${estadisticas.reinscripciones}`, pageWidth - 14, yPos, { align: 'right' });

    yPos += 10;

    // Filtros aplicados (si existen)
    if (filtros.tipo !== 'todos' || filtros.estatus !== 'todos') {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        let filtrosTexto = 'Filtros aplicados: ';
        if (filtros.tipo !== 'todos') filtrosTexto += `Tipo: ${filtros.tipo} `;
        if (filtros.estatus !== 'todos') filtrosTexto += `Estatus: ${filtros.estatus}`;
        doc.text(filtrosTexto, 14, yPos);
        yPos += 8;
    }

    // ============ TABLA DE SOLICITUDES ============
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Solicitudes', 14, yPos);

    yPos += 5;

    // Preparar datos para la tabla
    const tableData = solicitudes.map((solicitud, index) => [
        index + 1,
        solicitud.nombre || `${solicitud.nombre} ${solicitud.apellidoPaterno}`,
        solicitud.tipo === 'nuevo_ingreso' ? 'Nuevo Ingreso' : 'Reinscripción',
        solicitud.carrera || 'N/A',
        solicitud.turno ? solicitud.turno.charAt(0).toUpperCase() + solicitud.turno.slice(1) : 'N/A',
        getEstatusLabel(solicitud.estatus),
        new Date(solicitud.fechaSolicitud || Date.now()).toLocaleDateString('es-MX')
    ]);

    // Configurar tabla
    doc.autoTable({
        startY: yPos,
        head: [['#', 'Nombre', 'Tipo', 'Carrera', 'Turno', 'Estatus', 'Fecha']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 8,
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { cellWidth: 45 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35 },
            4: { halign: 'center', cellWidth: 20 },
            5: { halign: 'center', cellWidth: 25 },
            6: { halign: 'center', cellWidth: 25 }
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        didParseCell: function (data) {
            // Colorear la columna de estatus
            if (data.column.index === 5 && data.section === 'body') {
                const estatus = data.cell.raw;
                if (estatus === 'Aprobada') {
                    data.cell.styles.textColor = successColor;
                    data.cell.styles.fontStyle = 'bold';
                } else if (estatus === 'Rechazada') {
                    data.cell.styles.textColor = dangerColor;
                    data.cell.styles.fontStyle = 'bold';
                } else if (estatus === 'Pendiente') {
                    data.cell.styles.textColor = warningColor;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        margin: { top: 10, left: 14, right: 14 },
        didDrawPage: function (data) {
            // Pie de página en cada página
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            const totalPages = doc.internal.getNumberOfPages();

            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Página ${pageNumber} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );

            // Línea decorativa
            doc.setDrawColor(200, 200, 200);
            doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
        }
    });

    // ============ PIE DE DOCUMENTO ============
    const finalY = doc.lastAutoTable.finalY || yPos + 10;

    if (finalY < pageHeight - 40) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
            '© Sistema Nexum - Reporte confidencial generado automáticamente',
            pageWidth / 2,
            pageHeight - 20,
            { align: 'center' }
        );
    }

    // ============ GUARDAR PDF ============
    const fileName = `Solicitudes_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};

/**
 * Exporta estadísticas detalladas a PDF
 */
export const exportarEstadisticasPDF = (estadisticas) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Sistema Nexum', 14, 18);

    doc.setFontSize(12);
    doc.text('Reporte Estadístico', 14, 28);

    const fecha = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.setFontSize(10);
    doc.text(fecha, pageWidth - 14, 18, { align: 'right' });

    // Estadísticas detalladas
    let yPos = 60;

    const statsData = [
        ['Métrica', 'Valor'],
        ['Total de Solicitudes', estadisticas.total],
        ['Solicitudes Pendientes', estadisticas.pendientes],
        ['Solicitudes Aprobadas', estadisticas.aprobadas],
        ['Solicitudes Rechazadas', estadisticas.rechazadas],
        ['Tasa de Aprobación', `${estadisticas.tasaAprobacion}%`],
        ['Nuevo Ingreso', estadisticas.nuevoIngreso],
        ['Reinscripciones', estadisticas.reinscripciones]
    ];

    doc.autoTable({
        startY: yPos,
        head: [statsData[0]],
        body: statsData.slice(1),
        theme: 'striped',
        headStyles: {
            fillColor: [37, 99, 235],
            fontSize: 11,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 10
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 100 },
            1: { halign: 'center', cellWidth: 80 }
        }
    });

    const fileName = `Estadisticas_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};

// Helper functions
const getEstatusLabel = (estatus) => {
    const labels = {
        pendiente: 'Pendiente',
        aprobada: 'Aprobada',
        rechazada: 'Rechazada',
        en_revision: 'En Revisión'
    };
    return labels[estatus] || estatus;
};
