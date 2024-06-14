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
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
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
    marginBottom: 2,
  },
  firma: {
    borderTop: 1,
    borderColor: "#000000",
    width: "110px",
    marginTop: 70,
    marginHorizontal: 15,
  },
  table: {
    width: "100%",
  },
  rowTable: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #000",
    paddingTop: 12,
    paddingBottom: 12,
  },
  header: {
    borderTop: "none",
    backgroundColor: '#C0392B',
    paddingHorizontal: 20,
    color: "#FFF"
  },
  bold: {
    fontWeight: "bold",
  },
  col1: {
    width: "10%",
  },
  col2: {
    width: "15%",
  },
  col3: {
    width: "15%",
  },
  col4: {
    width: "10%",
  },
  col5: {
    width: "10%",
  },
  col6: {
    width: "15%",
  },
  col7: {
    width: "10%",
  },
  col8: {
    width: "15%",
  },
  emptyRow: {
    borderBottom: "1px solid #EEE",
    
  },
});
function RequestToPDF({ formData }) {
  // console.log(formData.processes[0].user.name);
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

        {/* <View>
          <Text style={styles.label}>Persona encargada:</Text>
          <Text style={styles.input}>
            {formData.processes[0].user.name}{" "}
            {formData.processes[0].user.lastName1}
          </Text>
        </View> */}

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
            <Text>‎ ‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ Sello</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.label}>
            Información sobre el abasto de combustible
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.rowTable, styles.bold, styles.header]}>
            <Text style={styles.col1}>Ciudad</Text>
            <Text style={styles.col2}>Comercio</Text>
            <Text style={styles.col3}>Kilometraje</Text>
            <Text style={styles.col4}>Litros</Text>
            <Text style={styles.col5}>Fecha</Text>
            <Text style={styles.col6}>Tarjeta</Text>
            <Text style={styles.col7}>Factura</Text>
            <Text style={styles.col8}>Autorización</Text>
          </View>

          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[styles.rowTable, styles.emptyRow]}
              wrap={false}
            >
              <Text style={styles.col1}>
                <Text style={styles.bold}></Text>
              </Text>
              <Text style={styles.col2}></Text>
              <Text style={styles.col3}></Text>
              <Text style={styles.col4}>
                <Text style={styles.bold}></Text>
              </Text>
              <Text style={styles.col5}></Text>
              <Text style={styles.col6}></Text>
              <Text style={styles.col7}></Text>
              <Text style={styles.col8}></Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default RequestToPDF;
