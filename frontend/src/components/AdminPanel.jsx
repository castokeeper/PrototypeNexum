import { useState, useMemo, useCallback, memo } from 'react';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Filter, BarChart3, Users, Clock, CheckCircle, XCircle, FileText, TrendingUp, Shield, Download, FileSpreadsheet } from 'lucide-react';
import { Button, Card } from './common';
import SolicitudCard from './admin/SolicitudCard';
import SolicitudDetalle from './admin/SolicitudDetalle';
import SolicitudesChart from './charts/SolicitudesChart';
import { TIPO_SOLICITUD, ESTATUS_SOLICITUD } from '../utils';
import { exportarSolicitudesPDF, exportarEstadisticasPDF } from '../utils/pdfExport';

// Componente memoizado para las stats cards con diseño moderno
const StatsCard = memo(({ icon: Icon, label, value, color, badge, gradient }) => {
  // Gradientes predefinidos más vibrantes
  const gradients = {
    blue: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
    orange: 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700',
    green: 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700',
    red: 'bg-gradient-to-br from-red-500 via-rose-600 to-pink-700'
  };

  return (
    <div className={`${gradients[color] || gradients.blue} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-scale-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          <Icon size={24} className="drop-shadow-lg" />
        </div>
        {badge && (
          <span className="text-xs font-semibold px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white/90 text-sm font-medium mb-1">{label}</p>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

// Componente memoizado para la barra de progreso con diseño mejorado
const ProgressBar = memo(({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: color }}></div>
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-32 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
        <span className="text-sm font-bold w-12 text-right text-slate-900 dark:text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

const AdminPanel = () => {
  const { solicitudes, actualizarEstatus } = useSolicitudes();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [exportando, setExportando] = useState(false);

  // Calcular estadísticas (memoizado)
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

  // Memoizar solicitudes filtradas
  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter(sol => {
      const pasaFiltroTipo = filtroTipo === 'todos' || sol.tipo === filtroTipo;
      const pasaFiltroEstatus = filtroEstatus === 'todos' || sol.estatus === filtroEstatus;
      return pasaFiltroTipo && pasaFiltroEstatus;
    });
  }, [solicitudes, filtroTipo, filtroEstatus]);

  // Handlers con useCallback para evitar re-renders
  const handleAprobar = useCallback(async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.APROBADA);
      toast.success('✓ Solicitud aprobada exitosamente');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al aprobar la solicitud');
      console.error('Error al aprobar:', error);
    }
  }, [actualizarEstatus]);

  const handleRechazar = useCallback(async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.RECHAZADA);
      toast.error('✗ Solicitud rechazada');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al rechazar la solicitud');
      console.error('Error al rechazar:', error);
    }
  }, [actualizarEstatus]);

  const handleExportarPDF = useCallback(() => {
    setExportando(true);
    try {
      const filtros = {
        tipo: filtroTipo,
        estatus: filtroEstatus
      };
      const fileName = exportarSolicitudesPDF(solicitudesFiltradas, estadisticas, filtros);
      toast.success(`📄 PDF generado: ${fileName}`);
    } catch (error) {
      toast.error('Error al generar el PDF');
      console.error('Error:', error);
    } finally {
      setExportando(false);
    }
  }, [solicitudesFiltradas, estadisticas, filtroTipo, filtroEstatus]);

  const handleExportarEstadisticas = useCallback(() => {
    setExportando(true);
    try {
      const fileName = exportarEstadisticasPDF(estadisticas);
      toast.success(`📊 Estadísticas exportadas: ${fileName}`);
    } catch (error) {
      toast.error('Error al exportar estadísticas');
      console.error('Error:', error);
    } finally {
      setExportando(false);
    }
  }, [estadisticas]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header con diseño mejorado */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 backdrop-blur-sm border border-primary-200 dark:border-primary-800 mb-4">
            <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Panel Administrativo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Gestiona solicitudes y monitorea el proceso de admisión con herramientas avanzadas
          </p>

          {/* Botones de Exportación con diseño mejorado */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={handleExportarPDF}
              disabled={exportando || solicitudesFiltradas.length === 0}
              loading={exportando}
              icon={<Download size={18} />}
              variant="primary"
              className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
              Exportar Solicitudes a PDF
            </Button>
            <Button
              onClick={handleExportarEstadisticas}
              disabled={exportando}
              loading={exportando}
              icon={<FileSpreadsheet size={18} />}
              variant="secondary"
              className="shadow-lg hover:shadow-xl"
            >
              Exportar Estadísticas
            </Button>
          </div>
        </div>

        {/* Estadísticas Cards con stagger animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={FileText}
            label="Total Solicitudes"
            value={estadisticas.total}
            color="blue"
            badge={<TrendingUp size={18} />}
          />
          <StatsCard
            icon={Clock}
            label="Pendientes"
            value={estadisticas.pendientes}
            color="orange"
            badge="⚡ Acción requerida"
          />
          <StatsCard
            icon={CheckCircle}
            label="Aprobadas"
            value={estadisticas.aprobadas}
            color="green"
            badge={`✓ ${estadisticas.tasaAprobacion}%`}
          />
          <StatsCard
            icon={XCircle}
            label="Rechazadas"
            value={estadisticas.rechazadas}
            color="red"
          />
        </div>

        {/* Gráficos y Estadísticas Detalladas con diseño moderno */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Pastel con efecto */}
          <Card className="animate-scale-in lg:col-span-2 p-0 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8 bg-gradient-to-br from-white via-slate-50 to-primary-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
              <SolicitudesChart
                data={estadisticas}
                title="Distribución de Solicitudes por Estatus"
              />
            </div>
          </Card>

          {/* Resumen de Estatus mejorado */}
          <Card className="animate-scale-in p-0 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-950/20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Métricas Clave
                </h3>
              </div>
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200 dark:border-green-800">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-green-700 dark:text-green-400">
                    Tasa de Aprobación
                  </p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-3">
                    {estadisticas.tasaAprobacion}%
                  </p>
                  <div className="w-full h-3 bg-green-200 dark:bg-green-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${estadisticas.tasaAprobacion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-blue-700 dark:text-blue-400">
                    Solicitudes Procesadas
                  </p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {estadisticas.aprobadas + estadisticas.rechazadas}
                  </p>
                  <p className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                    de <span className="font-bold">{estadisticas.total}</span> totales
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Estadísticas por Tipo con diseño mejorado */}
        <Card className="animate-scale-in p-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-950/20">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Por Tipo de Solicitud
              </h3>
            </div>
            <div className="space-y-5">
              <ProgressBar
                label="Nuevo Ingreso"
                value={estadisticas.nuevoIngreso}
                total={estadisticas.total}
                color="#3b82f6"
              />
              <ProgressBar
                label="Reinscripción"
                value={estadisticas.reinscripciones}
                total={estadisticas.total}
                color="#10b981"
              />
            </div>
          </div>
        </Card>

        {/* Filtros con diseño moderno */}
        <Card className="animate-scale-in overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Filter size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Filtros
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full lg:w-auto">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2 text-slate-600 dark:text-slate-400">
                    Tipo de Solicitud
                  </label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200 focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 outline-none cursor-pointer"
                  >
                    <option value="todos">📋 Todas</option>
                    <option value={TIPO_SOLICITUD.NUEVO_INGRESO}>🆕 Nuevo Ingreso</option>
                    <option value={TIPO_SOLICITUD.REINSCRIPCION}>🔄 Reinscripción</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2 text-slate-600 dark:text-slate-400">
                    Estatus
                  </label>
                  <select
                    value={filtroEstatus}
                    onChange={(e) => setFiltroEstatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200 focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 outline-none cursor-pointer"
                  >
                    <option value="todos">🔍 Todos</option>
                    <option value={ESTATUS_SOLICITUD.PENDIENTE}>⏳ Pendiente</option>
                    <option value={ESTATUS_SOLICITUD.APROBADA}>✅ Aprobada</option>
                    <option value={ESTATUS_SOLICITUD.RECHAZADA}>❌ Rechazada</option>
                  </select>
                </div>
              </div>

              <div className="py-3 px-5 rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 border border-primary-200 dark:border-primary-800 min-w-[120px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                  Resultados
                </p>
                <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                  {solicitudesFiltradas.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Solicitudes con diseño mejorado */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
            {filtroEstatus === 'todos' ? '📋 Todas las Solicitudes' :
              filtroEstatus === ESTATUS_SOLICITUD.PENDIENTE ? '⏳ Solicitudes Pendientes' :
                filtroEstatus === ESTATUS_SOLICITUD.APROBADA ? '✅ Solicitudes Aprobadas' :
                  '❌ Solicitudes Rechazadas'}
          </h2>

          {solicitudesFiltradas.length === 0 ? (
            <Card className="scale-in" style={{
              background: 'var(--bg-card)',
              borderRadius: '1.25rem'
            }}>
              <div className="p-12 text-center">
                <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
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
              {solicitudesFiltradas.map((solicitud, index) => (
                <div key={solicitud.id} className="scale-in" style={{ animationDelay: `${index * 50}ms` }}>
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

      {/* Modal de detalles */}
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
