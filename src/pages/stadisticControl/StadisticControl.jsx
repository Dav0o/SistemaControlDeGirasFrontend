import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getVehicles } from "../../services/VehicleService";
import { getUsers } from "../../services/UserService";
import { getMaintenance } from "../../services/MaintenanceService";
import { getRequests } from "../../services/RequestService";
import TotalHoursChart from './TotalHoursChart';
import GasolineYearlyChart from './GasolineYearlyChart';
import AvailableChart from './AvailableChart';

function StadisticControl() {
  const [cantidadVehiculos, setCantidadVehiculos] = useState(null);
  const [cantidadSolicitudes, setSolicitudes] = useState(null);
  const [cantidadUsuarios, setUsuarios] = useState(null);
  const [cantidadMantenimiento, setMantenimiento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [destinosFrecuentes, setDestinosFrecuentes] = useState({});
  const [filterDate, setFilterDate] = useState(null);
  const [showHistorical, setShowHistorical] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const handleDateChange = (date) => {
    setFilterDate(date);
  };

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const solicitudes = await getRequests();

        const solicitudesFiltradas = showHistorical
          ? solicitudes
          : solicitudes.filter((solicitud) => {
            const arriveDate = new Date(solicitud.arriveDate);
            return (
              (!filterDate || arriveDate.toDateString() === filterDate.toDateString()) &&
              (!selectedMonth || arriveDate.getMonth() + 1 === selectedMonth.value) // El +1 se debe a que getMonth() devuelve 0 para enero, 1 para febrero, etc.
            );
          });

        const destinos = solicitudesFiltradas.map((solicitud) => solicitud.destinyLocation);

        const destinosFrecuentes = destinos.reduce((acc, destino) => {
          acc[destino] = (acc[destino] || 0) + 1;
          return acc;
        }, {});

        // Control
        const sortedDestinos = Object.keys(destinosFrecuentes).sort((a, b) => destinosFrecuentes[b] - destinosFrecuentes[a]);
        const topDestinos = sortedDestinos.slice(0, 10);

        const destinosFrecuentesTop = {};
        topDestinos.forEach((destino) => {
          destinosFrecuentesTop[destino] = destinosFrecuentes[destino];
        });

        setDestinosFrecuentes(destinosFrecuentesTop);
      } catch (error) {
        console.error('Error al obtener las solicitudes', error);
      }
    };

    fetchData();
  }, [filterDate, showHistorical, selectedMonth]);

  const chartData = {
    labels: Object.keys(destinosFrecuentes),
    datasets: [
      {
        label: 'Número de visitas',
        data: Object.values(destinosFrecuentes),
        backgroundColor: 'rgba(75, 192, 192, 0.6',
      },
    ],
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const vehicles = await getVehicles();
        const cantidad = vehicles.length;
        setCantidadVehiculos(cantidad);

        const maintenance = await getMaintenance();
        const cantidadM = maintenance.length;
        setMantenimiento(cantidadM);

        const request = await getRequests();
        const cantidadR = request.length;
        setSolicitudes(cantidadR);

        const user = await getUsers();
        const cantidadU = user.length;
        setUsuarios(cantidadU);

        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener información:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
    <Modal show={isLoading} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Body>
        <div className="text-center">
          <i className="fas fa-cog fa-spin fa-3x"></i> {/* Icono de Font Awesome giratorio */}
          <h3 className="animated-text">Cargando el inicio</h3>
        </div>
      </Modal.Body>
    </Modal>

    {!isLoading && (
      <div>
        <div className="row">
          <div className="col-md-7">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Estadísticas Generales</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-6 col-md-6 mb-5">
                    <div className="card border-left-success shadow h-90 py-1">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-3">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Vehículos
                            </div>
                            <div className="h5 mb-1 font-weight-bold text-gray-800">{cantidadVehiculos}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fa-solid fa-car-side fa-2x text-gray-300 mr-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 mb-5">
                    <div className="card border-left-success shadow h-90 py-1">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Usuarios
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{cantidadUsuarios}</div>
                          </div>
                          <div className="col-auto">
                           
                            <i className="fa-solid fa-user-plus  fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 mb-5">
                    <div className="card border-left-success shadow h-90 py-1">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-3">
                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                              Solicitudes
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{cantidadSolicitudes}</div>
                          </div>
                          <div className="col-auto">
                            <i className="fa-solid fa-code-pull-request fa-2x text-gray-300"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-md-6 mb-6">
                    <div className="card border-left-success shadow h-90 py-1">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-0">
                              Mantenimiento
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800+">{cantidadMantenimiento}</div>
                          </div>
                          <div className="col-auto">
                          <i className="fa-solid fa-car-burst fa-2x text-gray-300 mr-1"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>
              
            </div> 
            <div className="row">
      <div className="col-md-6">
        <div> <TotalHoursChart /></div>
      </div>
     {/*  <div className="col-md-6">
        <div> <GasolineYearlyChart /></div>
      </div> */}
      
    </div>
          </div>
          
          
          <div className="col-md-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-1 font-weight-bold text-primary">Destinos más visitados</h6>
              </div>
              <div className="card-body">
                <div>
                  <button className="btn btn-info mr-2" onClick={() => setShowHistorical(true)}>Todos</button>
                  <button className="btn btn-info" onClick={() => setShowHistorical(false)}>Por mes</button>
                </div>
                <div className="mt-2">
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={months}
                    placeholder="Selecciona un mes"
                  />
                </div>
                <Bar data={chartData} className="mt-2" />
                {/* <div className="mt-2">
                  <label className="mr-2">Búsqueda por fecha</label>
                  <DatePicker selected={filterDate} onChange={handleDateChange} />
                </div>     */}           
              </div>
            </div>
            <div className="col-md-6">
        <div> <AvailableChart/></div>
      </div>
          </div>      
        </div>
      </div>
    )}
  </div>
);
}

export default StadisticControl;
