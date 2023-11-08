import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getDriverLog } from '../../services/DriverLogService';
import Select from 'react-select';

function HoursChart() {
  const [driverLogs, setDriverLogs] = useState([]);
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

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamada al servicio getDriverLog para obtener los datos de las horas extra
        const driverLogsData = await getDriverLog();

        setDriverLogs(driverLogsData);
      } catch (error) {
        console.error('Error al obtener los registros de los conductores', error);
      }
    };

    fetchData();
  }, []);

  const calculatePercentage = (logs, selectedMonth) => {
    if (!selectedMonth) return 0;
  
    const currentYear = new Date().getFullYear();
  
    const logsForMonthAndYear = logs.filter((log) => {
      const logDate = new Date(log.initialLogDate);
      const logMonth = logDate.getMonth() + 1;
      const logYear = logDate.getFullYear();
  
      return logMonth === selectedMonth.value && logYear === currentYear;
    });
  
    const totalExtraHours = logsForMonthAndYear.reduce((acc, log) => acc + log.extraHours, 0);
    const totalOrdinaryHours = logsForMonthAndYear.reduce((acc, log) => acc + log.ordinaryHours, 0);
    const totalBonusHours = logsForMonthAndYear.reduce((acc, log) => acc + log.bonusHours, 0);
  
    const totalHours = totalOrdinaryHours + totalExtraHours + totalBonusHours;
  
    if (totalHours === 0) {
      return 0; // Evitar la división por cero
    }
  
    return ((totalExtraHours / totalHours) * 100).toFixed(2);
  };
  const percentage = calculatePercentage(driverLogs, selectedMonth);

  const chartData = {
    labels: ['Porcentaje de horas extra'],
    datasets: [
      {
        label: 'Porcentaje',
        data: [percentage],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
  return (
    <div className="card shadow mb-3">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Porcentaje de Horas Extra</h6>
      </div>
      <div className="card-body">
        <div>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            options={months}
            placeholder="Selecciona un mes"
          />
        </div>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default HoursChart;
