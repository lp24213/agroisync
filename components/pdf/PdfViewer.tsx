import React from 'react';

interface PDFViewerProps {
  file: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => (
  <iframe
    src={file}
    title="PDF Viewer"
    className="w-full h-[80vh] border rounded-xl"
    frameBorder={0}
  />
);

export default PDFViewer;
