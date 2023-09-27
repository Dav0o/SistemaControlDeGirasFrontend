import React from 'react';
import { getVehicles } from "../../services/VehicleService";
import { useQuery, useMutation } from 'react-query';
import { Button, Table } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { create } from '../../services/MaintenanceService';
import { useState, useEffect } from 'react';

function Vehicle() {
    const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
        enabled: true,
    });
    const mutation = useMutation("maintenances", create);
    
    const [dataTable, setDataTable] = useState(null);
    
    useEffect(() => {
        if (dataTable) {
            // Destruye el DataTable existente antes de volver a inicializarlo
            dataTable.destroy();
        }
        
        // Inicializa el DataTable después de renderizar los datos
        const newDataTable = new DataTable('#tableMaintenance', {
            retrieve: true,
            responsive: true,
            dom: "Bfrtp",
            buttons: [
                {
                    extend: "excelHtml5",
                    text: '<i class="fa-solid fa-file-csv"></i>',
                    titleAttr: "Exportar a Excel",
                    className: "btn btn-success",
                },
                {
                    extend: "pdfHtml5",
                    text: '<i class="fa-regular fa-file-pdf"></i>',
                    titleAttr: "Exportar a PDF",
                    className: "btn btn-danger",
                },
                {
                    extend: "print",
                    text: '<i class="fa-solid fa-print"></i>',
                    titleAttr: "Imprimir",
                    className: "btn btn-info",
                },
            ],
        });
        
        // Actualiza el estado para mantener la referencia del DataTable
        setDataTable(newDataTable);
    }, [data]);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (isError) {
        return <div>Error</div>;
    }
    
    return (
        <>
            <Container>
                <Row>
                    <h2>Lista de Vehiculos</h2>
                    <p>Observar el mantenimiento de cada uno de los vehiculos</p>
                </Row>
                
                <Table striped="columns" id='tableMaintenance' className='display wrap'>
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Color</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {data.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.plate_Number}</td>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.color}</td>
                                <td>
                                    <Link to={`/vehicle/${vehicle.id}`}>
                                        <Button variant="info"> Detalles </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Vehicle;
