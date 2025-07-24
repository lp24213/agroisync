# PdfViewer

Componente para visualização de arquivos PDF no projeto AGROTM. Utiliza iframe para exibir PDFs de forma responsiva.

## Uso
```tsx
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@/components/pdf/PdfViewer'), { ssr: false });

<PDFViewer file="/whitepaper.pdf" />
``` 