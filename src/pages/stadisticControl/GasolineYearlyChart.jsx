import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Select from 'react-select';
import { getRequestGasoline } from '../../services/RequestGasolineService';

function GasolineYearlyChart() {
  const [gasolineData, setGasolineData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequestGasoline();

        const currentYear = new Date().getFullYear();
        const filteredData = response.filter((entry) => {
          const entryDate = new Date(entry.createDate);
          return entryDate.getFullYear() === currentYear;
        });

        setGasolineData(filteredData);
      } catch (error) {
        console.error('Error al obtener los datos de consumo de gasolina', error);
      }
    };

    fetchData();
  }, []);

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

  const calculatePercentage = (gasolineData, selectedMonth) => {
    if (gasolineData.length === 0 || !selectedMonth) return 0;
    const selectedMonthNumber = selectedMonth.value;
    const filteredData = gasolineData.filter((entry) => {
      const entryDate = new Date(entry.createDate);
      return entryDate.getMonth() + 1 === selectedMonthNumber; // +1 porque los meses comienzan desde 0 (enero)
    });

    const totalLitresThisMonth = filteredData.reduce((acc, entry) => acc + entry.litres, 0);
    return totalLitresThisMonth;
  };

  const percentage = calculatePercentage(gasolineData, selectedMonth);

  const chartData = {
    labels: ['Total de litros de gasolina al mes'],
    datasets: [
      {
        data: [percentage],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
  const cardStyles = {
    width: '300px',
    height: '400px',
  };

  return (
    <div className="card shadow mb-4" style ={cardStyles}>
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Gasto de gasolina al año</h6>
      </div>
      <div className="card-body">
        <div className="mt-0">
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

export default GasolineYearlyChart;
