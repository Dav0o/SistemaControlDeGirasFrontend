import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import RequestToPDF from './RequestToPDF';


const PdfPreview = ({ formData }) => (
  <PDFViewer width="100%" height="600">
    <RequestToPDF formData={formData} />
  </PDFViewer>
);

export default PdfPreview;