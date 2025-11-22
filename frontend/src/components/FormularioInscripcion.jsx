/**
 * Formulario de Inscripción Multi-Step
 * Para aspirantes que han sido aceptados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    User,
    GraduationCap,
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

const FormularioInscripcion = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [carreras, setCarreras] = useState([]);

    // Datos del formulario
    const [datosPersonales, setDatosPersonales] = useState({
        nombreCompleto: '',
        curp: '',
        genero: '',
        estadoCivil: '',
        lugarNacimiento: '',
        nacionalidad: 'Mexicana',
        telefono: '',
        email: '',
        direccionCompleta: '',
        municipio: '',
        estado: '',
        codigoPostal: ''
    });

    const [datosAcademicos, setDatosAcademicos] = useState({
        escuelaProcedencia: '',
        promedioSecundaria: '',
        ultimoGradoCursado: '',
        certificadoObtenido: false,
        anioEgreso: ''
    });

    const [datosTutor, setDatosTutor] = useState({
        nombreTutor: '',
        parentesco: '',
        telefonoTutor: '',
        ocupacion: '',
        direccionTutor: ''
    });

    const [datosInscripcion, setDatosInscripcion] = useState({
        carreraId: '',
        turno: '',
        grupo: ''
    });

    useEffect(() => {
        cargarCarreras();
    }, []);

    const cargarCarreras = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/carreras');
            const data = await response.json();
            setCarreras(data);
        } catch (error) {
            console.error('Error al cargar carreras:', error);
            toast.error('Error al cargar las carreras');
        }
    };

    const handleNext = () => {
        if (validarPaso(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const validarPaso = (currentStep) => {
        switch (currentStep) {
            case 1:
                if (!datosPersonales.nombreCompleto || !datosPersonales.curp ||
                    !datosPersonales.telefono || !datosPersonales.email) {
                    toast.error('Por favor completa todos los campos obligatorios');
                    return false;
                }
                return true;
            case 2:
                if (!datosAcademicos.escuelaProcedencia || !datosAcademicos.promedioSecundaria) {
                    toast.error('Por favor completa los datos académicos');
                    return false;
                }
                return true;
            case 3:
                if (!datosTutor.nombreTutor || !datosTutor.telefonoTutor) {
                    toast.error('Por favor completa los datos del tutor');
                    return false;
                }
                return true;
            case 4:
                if (!datosInscripcion.carreraId || !datosInscripcion.turno) {
                    toast.error('Por favor completa los datos de inscripción');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarPaso(step)) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/solicitudes/inscripcion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    datosPersonales,
                    datosAcademicos,
                    datosTutor,
                    carreraId: datosInscripcion.carreraId,
                    turno: datosInscripcion.turno,
                    grupo: datosInscripcion.grupo
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('¡Formulario enviado exitosamente!');
                setStep(5); // Paso de confirmación
            } else {
                toast.error(data.error || 'Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar el formulario');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderDatosPersonales();
            case 2:
                return renderDatosAcademicos();
            case 3:
                return renderDatosTutor();
            case 4:
                return renderDatosInscripcion();
            case 5:
                return renderConfirmacion();
            default:
                return null;
        }
    };

    const renderDatosPersonales = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Datos Personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        value={datosPersonales.nombreCompleto}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, nombreCompleto: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CURP *
                    </label>
                    <input
                        type="text"
                        maxLength={18}
                        value={datosPersonales.curp}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, curp: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Género *
                    </label>
                    <select
                        value={datosPersonales.genero}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, genero: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado Civil *
                    </label>
                    <select
                        value={datosPersonales.estadoCivil}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, estadoCivil: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="soltero">Soltero/a</option>
                        <option value="casado">Casado/a</option>
                        <option value="union_libre">Unión Libre</option>
                        <option value="divorciado">Divorciado/a</option>
                        <option value="viudo">Viudo/a</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lugar de Nacimiento *
                    </label>
                    <input
                        type="text"
                        value={datosPersonales.lugarNacimiento}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, lugarNacimiento: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                    </label>
                    <input
                        type="tel"
                        value={datosPersonales.telefono}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, telefono: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={datosPersonales.email}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección Completa *
                    </label>
                    <input
                        type="text"
                        value={datosPersonales.direccionCompleta}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, direccionCompleta: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Municipio *
                    </label>
                    <input
                        type="text"
                        value={datosPersonales.municipio}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, municipio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                    </label>
                    <input
                        type="text"
                        value={datosPersonales.estado}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, estado: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal *
                    </label>
                    <input
                        type="text"
                        maxLength={5}
                        value={datosPersonales.codigoPostal}
                        onChange={(e) => setDatosPersonales({ ...datosPersonales, codigoPostal: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderDatosAcademicos = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Datos Académicos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Escuela de Procedencia *
                    </label>
                    <input
                        type="text"
                        value={datosAcademicos.escuelaProcedencia}
                        onChange={(e) => setDatosAcademicos({ ...datosAcademicos, escuelaProcedencia: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Promedio de Secundaria *
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        min="6"
                        max="10"
                        value={datosAcademicos.promedioSecundaria}
                        onChange={(e) => setDatosAcademicos({ ...datosAcademicos, promedioSecundaria: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Último Grado Cursado *
                    </label>
                    <select
                        value={datosAcademicos.ultimoGradoCursado}
                        onChange={(e) => setDatosAcademicos({ ...datosAcademicos, ultimoGradoCursado: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="secundaria">Secundaria</option>
                        <option value="preparatoria">Preparatoria (parcial)</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año de Egreso *
                    </label>
                    <input
                        type="number"
                        min="2000"
                        max={new Date().getFullYear()}
                        value={datosAcademicos.anioEgreso}
                        onChange={(e) => setDatosAcademicos({ ...datosAcademicos, anioEgreso: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="certificado"
                        checked={datosAcademicos.certificadoObtenido}
                        onChange={(e) => setDatosAcademicos({ ...datosAcademicos, certificadoObtenido: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="certificado" className="text-sm font-medium text-gray-700">
                        Certificado Obtenido
                    </label>
                </div>
            </div>
        </div>
    );

    const renderDatosTutor = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Datos del Tutor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Tutor *
                    </label>
                    <input
                        type="text"
                        value={datosTutor.nombreTutor}
                        onChange={(e) => setDatosTutor({ ...datosTutor, nombreTutor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parentesco *
                    </label>
                    <select
                        value={datosTutor.parentesco}
                        onChange={(e) => setDatosTutor({ ...datosTutor, parentesco: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="padre">Padre</option>
                        <option value="madre">Madre</option>
                        <option value="hermano">Hermano/a</option>
                        <option value="abuelo">Abuelo/a</option>
                        <option value="tio">Tío/a</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono del Tutor *
                    </label>
                    <input
                        type="tel"
                        value={datosTutor.telefonoTutor}
                        onChange={(e) => setDatosTutor({ ...datosTutor, telefonoTutor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ocupación *
                    </label>
                    <input
                        type="text"
                        value={datosTutor.ocupacion}
                        onChange={(e) => setDatosTutor({ ...datosTutor, ocupacion: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección del Tutor *
                    </label>
                    <input
                        type="text"
                        value={datosTutor.direccionTutor}
                        onChange={(e) => setDatosTutor({ ...datosTutor, direccionTutor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderDatosInscripcion = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Datos de Inscripción
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carrera *
                    </label>
                    <select
                        value={datosInscripcion.carreraId}
                        onChange={(e) => setDatosInscripcion({ ...datosInscripcion, carreraId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar carrera...</option>
                        {carreras.map(carrera => (
                            <option key={carrera.id} value={carrera.id}>
                                {carrera.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Turno *
                    </label>
                    <select
                        value={datosInscripcion.turno}
                        onChange={(e) => setDatosInscripcion({ ...datosInscripcion, turno: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar turno...</option>
                        <option value="matutino">Matutino</option>
                        <option value="vespertino">Vespertino</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grupo (Opcional)
                    </label>
                    <input
                        type="text"
                        value={datosInscripcion.grupo}
                        onChange={(e) => setDatosInscripcion({ ...datosInscripcion, grupo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );

    const renderConfirmacion = () => (
        <div className="text-center py-12">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Formulario Enviado!
            </h3>
            <p className="text-lg text-gray-600 mb-8">
                Tu solicitud de inscripción ha sido enviada exitosamente.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                <h4 className="font-semibold text-blue-900 mb-2">Próximo Paso:</h4>
                <p className="text-blue-700">
                    Debes realizar el pago de inscripción para completar tu proceso.
                </p>
            </div>
            <button
                onClick={() => navigate('/portal-aspirante')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
                Ir al Portal
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Formulario de Inscripción
                    </h1>
                    <p className="text-gray-600">
                        Completa todos los datos para proceder con tu inscripción
                    </p>
                </div>

                {/* Progress Bar */}
                {step < 5 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Paso {step} de 4
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                                {Math.round((step / 4) * 100)}% Completado
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit}>
                        {renderStep()}

                        {/* Buttons */}
                        {step < 5 && (
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={step === 1}
                                    className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${step === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Anterior
                                </button>

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        Siguiente
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${loading
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                            } text-white`}
                                    >
                                        {loading ? 'Enviando...' : 'Enviar Formulario'}
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioInscripcion;
