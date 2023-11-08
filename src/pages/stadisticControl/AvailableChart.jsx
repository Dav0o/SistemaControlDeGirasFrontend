import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { getVehicles } from '../../services/VehicleService';
import { getMaintenance } from '../../services/MaintenanceService';

function AvalaibleChart() {
    const [cantidadVehiculos, setCantidadVehiculos] = useState(0);
    const [cantidadMantenimiento, setCantidadMantenimiento] = useState(0);
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const vehicles = await getVehicles();
          setCantidadVehiculos(vehicles.length);
  
          const maintenance = await getMaintenance();
          setCantidadMantenimiento(maintenance.length);
  
          const disponibles = vehicles.length - maintenance.length;
          setVehiculosDisponibles(disponibles);
  
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener información:', error);
        }
      }
  
      fetchData();
    }, []);
  
    const chartData = {
        labels: ['Disponibles', 'No disponibles'],
        datasets: [
          {
            data: [vehiculosDisponibles, cantidadMantenimiento],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6'], // Colores de fondo personalizados
            
          },
        ],
      };
      const cardStyles = {
        width: '350px', 
        height: '400px', 
      };
    

  return (
    <div>
    <div className="card shadow mb-3" style={cardStyles}>
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Disponibilidad de vehículos</h6>
      </div>
      <div className="card-body">
        <Doughnut data={chartData}  />
       
      </div>
    </div>
  </div>
);
}

export default AvalaibleChart;
