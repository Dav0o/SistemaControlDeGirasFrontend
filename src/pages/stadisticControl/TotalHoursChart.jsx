import React, { useEffect, useState } from 'react';
import { Doughnut} from 'react-chartjs-2';
import Select from 'react-select';
import { getDriverLog } from '../../services/DriverLogService';

function TotalHoursChart() {
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
        const driverLogsData = await getDriverLog();

        setDriverLogs(driverLogsData);
      } catch (error) {
        console.error('Error al obtener los registros de los conductores', error);
      }
    };

    fetchData();
  }, []);

  const calculatePercentage = (logs, selectedMonth) => {
    if (!selectedMonth) return { laboradas: 0, bonus: 0, ordinarias: 0 };

    const logsForMonth = logs.filter((log) => {
      const logDate = new Date(log.initialLogDate);
      const logMonth = logDate.getMonth() + 1;
      const logYear = logDate.getFullYear();
      const currentYear = new Date().getFullYear();

      return logMonth === selectedMonth.value && logYear === currentYear;
    });

    const totalOrdinaryHours = logsForMonth.reduce((acc, log) => acc + log.ordinaryHours, 0);
    const totalExtraHours = logsForMonth.reduce((acc, log) => acc + log.extraHours, 0);
    const totalBonusHours = logsForMonth.reduce((acc, log) => acc + log.bonusHours, 0);
    const totalHours = totalOrdinaryHours + totalExtraHours + totalBonusHours;

    if (totalHours === 0) {
      return { laboradas: 0, bonus: 0, ordinarias: 0 }; // Evitar la división por cero
    }

    return {
      laboradas: ((totalOrdinaryHours / totalHours) * 100).toFixed(2),
      bonus: ((totalBonusHours / totalHours) * 100).toFixed(2),
      ordinarias: ((totalExtraHours / totalHours) * 100).toFixed(2),
    };
  };

  const percentages = calculatePercentage(driverLogs, selectedMonth);

  const chartData = {
    labels: ['Horas laboradas', 'Horas bonus', 'Horas extras'],
    datasets: [
      {
        data: [percentages.laboradas, percentages.bonus, percentages.ordinarias],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      },
    ],
  };

  const cardStyles = {
    width: '300px', 
    height: '390px', 
  };


  return (
    <div className="card shadow mb-3" style={cardStyles}>
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Horas laboradas</h6>
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
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}

export default TotalHoursChart;
