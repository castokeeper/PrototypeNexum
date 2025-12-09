import { useState, useMemo, useCallback, memo } from 'react';
import { useSolicitudes } from '../context/SolicitudesContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { Filter, BarChart3, Users, Clock, CheckCircle, XCircle, FileText, TrendingUp, Shield, Download, FileSpreadsheet } from 'lucide-react';
import { Button, Card } from './common';
import SolicitudCard from './admin/SolicitudCard';
import SolicitudDetalle from './admin/SolicitudDetalle';
import SolicitudesChart from './charts/SolicitudesChart';
import { TIPO_SOLICITUD, ESTATUS_SOLICITUD } from '../utils';
import { exportarSolicitudesPDF, exportarEstadisticasPDF } from '../utils/pdfExport';

const StatsCard = memo(({ icon: Icon, label, value, color, badge, isDark }) => {
  const gradients = {
    blue: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
    orange: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  };

  return (
    <div
      className="rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      style={{ background: gradients[color] || gradients.blue }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Icon size={24} />
        </div>
        {badge && (
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm font-medium mb-1" style={{ opacity: 0.9 }}>{label}</p>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

const ProgressBar = memo(({ label, value, total, color, isDark }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-32 h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span
          className="text-sm font-bold w-12 text-right"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

const AdminPanel = () => {
  const { solicitudes, actualizarEstatus } = useSolicitudes();
  const { isDark } = useTheme();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [exportando, setExportando] = useState(false);

  const estadisticas = useMemo(() => {
    const total = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.estatus === ESTATUS_SOLICITUD.PENDIENTE).length;
    const aprobadas = solicitudes.filter(s => s.estatus === ESTATUS_SOLICITUD.APROBADA).length;
    const rechazadas = solicitudes.filter(s => s.estatus === ESTATUS_SOLICITUD.RECHAZADA).length;
    const nuevoIngreso = solicitudes.filter(s => s.tipo === TIPO_SOLICITUD.NUEVO_INGRESO).length;
    const reinscripciones = solicitudes.filter(s => s.tipo === TIPO_SOLICITUD.REINSCRIPCION).length;

    return {
      total,
      pendientes,
      aprobadas,
      rechazadas,
      nuevoIngreso,
      reinscripciones,
      tasaAprobacion: total > 0 ? ((aprobadas / total) * 100).toFixed(1) : 0
    };
  }, [solicitudes]);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter(sol => {
      const pasaFiltroTipo = filtroTipo === 'todos' || sol.tipo === filtroTipo;
      const pasaFiltroEstatus = filtroEstatus === 'todos' || sol.estatus === filtroEstatus;
      return pasaFiltroTipo && pasaFiltroEstatus;
    });
  }, [solicitudes, filtroTipo, filtroEstatus]);

  const handleAprobar = useCallback(async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.APROBADA);
      toast.success('Solicitud aprobada exitosamente');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al aprobar la solicitud');
    }
  }, [actualizarEstatus]);

  const handleRechazar = useCallback(async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.RECHAZADA);
      toast.info('Solicitud rechazada');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al rechazar la solicitud');
    }
  }, [actualizarEstatus]);

  const handleExportarPDF = useCallback(() => {
    setExportando(true);
    try {
      const filtros = { tipo: filtroTipo, estatus: filtroEstatus };
      exportarSolicitudesPDF(solicitudesFiltradas, estadisticas, filtros);
      toast.success('PDF generado correctamente');
    } catch (error) {
      toast.error('Error al generar el PDF');
    } finally {
      setExportando(false);
    }
  }, [solicitudesFiltradas, estadisticas, filtroTipo, filtroEstatus]);

  const handleExportarEstadisticas = useCallback(() => {
    setExportando(true);
    try {
      exportarEstadisticasPDF(estadisticas);
      toast.success('Estadisticas exportadas');
    } catch (error) {
      toast.error('Error al exportar estadisticas');
    } finally {
      setExportando(false);
    }
  }, [estadisticas]);

  const containerBg = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: containerBg }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
            }}
          >
            <Shield className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--primary-blue)' }}>
              Panel Administrativo
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Panel de Administracion
          </h1>

          <p style={{ color: 'var(--text-secondary)' }}>
            Gestiona solicitudes y monitorea el proceso de admision
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={handleExportarPDF}
              disabled={exportando || solicitudesFiltradas.length === 0}
              loading={exportando}
              icon={<Download size={18} />}
              variant="primary"
            >
              Exportar Solicitudes PDF
            </Button>
            <Button
              onClick={handleExportarEstadisticas}
              disabled={exportando}
              loading={exportando}
              icon={<FileSpreadsheet size={18} />}
              variant="secondary"
            >
              Exportar Estadisticas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={FileText}
            label="Total Solicitudes"
            value={estadisticas.total}
            color="blue"
            badge={<TrendingUp size={18} />}
            isDark={isDark}
          />
          <StatsCard
            icon={Clock}
            label="Pendientes"
            value={estadisticas.pendientes}
            color="orange"
            badge="Accion requerida"
            isDark={isDark}
          />
          <StatsCard
            icon={CheckCircle}
            label="Aprobadas"
            value={estadisticas.aprobadas}
            color="green"
            badge={`${estadisticas.tasaAprobacion}%`}
            isDark={isDark}
          />
          <StatsCard
            icon={XCircle}
            label="Rechazadas"
            value={estadisticas.rechazadas}
            color="red"
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            className="lg:col-span-2 p-0 overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            <div className="p-8">
              <SolicitudesChart
                data={estadisticas}
                title="Distribucion de Solicitudes por Estatus"
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden" style={{ backgroundColor: cardBg }}>
            <div className="p-6">
              <div
                className="flex items-center gap-3 mb-6 pb-4"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)' }}
                >
                  <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Metricas Clave
                </h3>
              </div>

              <div className="space-y-5">
                <div
                  className="p-5 rounded-xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid #10b981'
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#10b981' }}>
                    Tasa de Aprobacion
                  </p>
                  <p className="text-4xl font-bold mb-3" style={{ color: '#10b981' }}>
                    {estadisticas.tasaAprobacion}%
                  </p>
                  <div
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${estadisticas.tasaAprobacion}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                      }}
                    />
                  </div>
                </div>

                <div
                  className="p-5 rounded-xl"
                  style={{
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid #3b82f6'
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#3b82f6' }}>
                    Solicitudes Procesadas
                  </p>
                  <p className="text-4xl font-bold" style={{ color: '#3b82f6' }}>
                    {estadisticas.aprobadas + estadisticas.rechazadas}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#3b82f6' }}>
                    de <span className="font-bold">{estadisticas.total}</span> totales
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden" style={{ backgroundColor: cardBg }}>
          <div className="p-6">
            <div
              className="flex items-center gap-3 mb-6 pb-4"
              style={{ borderBottom: '1px solid var(--border-color)' }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: '#3b82f6' }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Por Tipo de Solicitud
              </h3>
            </div>
            <div className="space-y-5">
              <ProgressBar
                label="Nuevo Ingreso"
                value={estadisticas.nuevoIngreso}
                total={estadisticas.total}
                color="#3b82f6"
                isDark={isDark}
              />
              <ProgressBar
                label="Reinscripcion"
                value={estadisticas.reinscripciones}
                total={estadisticas.total}
                color="#10b981"
                isDark={isDark}
              />
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden" style={{ backgroundColor: cardBg }}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }}
                >
                  <Filter size={20} style={{ color: 'var(--primary-blue)' }} />
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Filtros
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full lg:w-auto">
                <div className="flex-1">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Tipo de Solicitud
                  </label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <option value="todos">Todas</option>
                    <option value={TIPO_SOLICITUD.NUEVO_INGRESO}>Nuevo Ingreso</option>
                    <option value={TIPO_SOLICITUD.REINSCRIPCION}>Reinscripcion</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Estatus
                  </label>
                  <select
                    value={filtroEstatus}
                    onChange={(e) => setFiltroEstatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value={ESTATUS_SOLICITUD.PENDIENTE}>Pendiente</option>
                    <option value={ESTATUS_SOLICITUD.APROBADA}>Aprobada</option>
                    <option value={ESTATUS_SOLICITUD.RECHAZADA}>Rechazada</option>
                  </select>
                </div>
              </div>

              <div
                className="py-3 px-5 rounded-xl min-w-[120px]"
                style={{
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid var(--primary-blue)'
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--primary-blue)' }}>
                  Resultados
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--primary-blue)' }}>
                  {solicitudesFiltradas.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            {filtroEstatus === 'todos' ? 'Todas las Solicitudes' :
              filtroEstatus === ESTATUS_SOLICITUD.PENDIENTE ? 'Solicitudes Pendientes' :
                filtroEstatus === ESTATUS_SOLICITUD.APROBADA ? 'Solicitudes Aprobadas' :
                  'Solicitudes Rechazadas'}
          </h2>

          {solicitudesFiltradas.length === 0 ? (
            <Card style={{ backgroundColor: cardBg }}>
              <div className="p-12 text-center">
                <div
                  className="inline-flex p-6 rounded-full mb-4"
                  style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                >
                  <FileText size={48} style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No hay solicitudes
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No se encontraron solicitudes con los filtros seleccionados
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {solicitudesFiltradas.map((solicitud) => (
                <div key={solicitud.id}>
                  <SolicitudCard
                    solicitud={solicitud}
                    onVerDetalles={setSolicitudSeleccionada}
                    onAprobar={handleAprobar}
                    onRechazar={handleRechazar}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SolicitudDetalle
        solicitud={solicitudSeleccionada}
        onClose={() => setSolicitudSeleccionada(null)}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </div>
  );
};

export default memo(AdminPanel);
