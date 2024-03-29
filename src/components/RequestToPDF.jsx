import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../assets/UNA2LINErojo0.png";
import axios from "axios";
import { getByIdUser } from "../services/UserService";



const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontSize: 14,
  },
  logouna: {
    width: "50",
  },
  column: {
    flexDirection: "column",
    flexGrow: 1,
    width: "50%", // Divide la página en dos columnas
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#e9ecef",
    padding: 6,
  },
  inputarea: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    backgroundColor: "#e9ecef",
    padding: 5,
    marginBottom: 5,
  },
  firma: {
    borderTop: 1,
    borderColor: "#000000",
    marginTop: 70,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableCellHeader: {
    margin: 5,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5, // Añadir espacio adicional
    fontSize: 12,
    borderRight: 1,
  },
  tableCell: {
    margin: 5,
    borderRight: 1,
    flex: 1,
    textAlign: 'center',
    padding: 8, // Añadir espacio adicional
  },
});
function RequestToPDF({ formData, userData }) {
  
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.rowBetween}>
          <View>
            <Image src={logo} style={styles.logouna} />
          </View>
          <View>
            <Text>{formData.consecutiveNumber}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.label}>Tipo de gira:</Text>
              <Text style={styles.input}>{formData.typeRequest}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.label}>Unidad ejecutora:</Text>
              <Text style={styles.input}>{formData.executingUnit}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Objetivo:</Text>
          <Text style={styles.input}>{formData.objective}</Text>
        </View>

        <View>
          <Text style={styles.label}>Número de personas:</Text>
          <Text style={styles.input}>{formData.personsAmount}</Text>
        </View>

        <View>
          <Text style={styles.label}>Persona encargada:</Text>
          <Text style={styles.input}></Text>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <View>
              <Text style={styles.label}>Fecha y hora de salida:</Text>
              <Text style={styles.input}>
                {formData.departureDate.substring(0, 10) +
                  " " +
                  formData.departureDate.substring(11, 16)}
              </Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Fecha y hora de regreso:</Text>
            <Text style={styles.input}>
              {formData.arriveDate.substring(0, 10) +
                " " +
                formData.arriveDate.substring(11, 16)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <View>
              <Text style={styles.label}>Lugar de salida:</Text>
              <Text style={styles.input}>{formData.departureLocation}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Lugar de destino:</Text>
            <Text style={styles.input}>{formData.destinyLocation}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Chofer:</Text>
            <Text style={styles.input}>
              {formData.driver == null
                ? ""
                : formData.driver.dni + " " + formData.driver.name}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Vehículo de la solicitud:</Text>
            <Text style={styles.input}>{formData.vehicle.plate_Number}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Condición:</Text>
            <Text style={styles.input}>{formData.condition}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Prioridad:</Text>
            <Text style={styles.input}>{formData.priority}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.label}>Itinerario:</Text>
          <Text style={styles.inputarea}>{formData.itinerary}</Text>
        </View>

        <View>
          <Text style={styles.label}>Observaciones:</Text>
          <Text style={styles.inputarea}>{formData.observations}</Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.firma}>
            <Text>Firma encargado</Text>
          </View>
          <View style={styles.firma}>
            <Text>Firma chofer</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
      <View>
      <Text style={styles.label}>Información sobre el abasto de combustible</Text>
      </View>
        <View style={styles.table}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Ciudad</Text>
            <Text style={styles.tableCellHeader}>Comercio</Text>
            <Text style={styles.tableCellHeader}>Kilometraje</Text>
            <Text style={styles.tableCellHeader}>Litros</Text>
            <Text style={styles.tableCellHeader}>Fecha</Text>
            <Text style={styles.tableCellHeader}>Tarjeta</Text>
            <Text style={styles.tableCellHeader}>Factura</Text>
            <Text style={styles.tableCellHeader}>Autorización</Text>
          </View>

          {/* Filas en blanco para escribir datos */}
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default RequestToPDF;
