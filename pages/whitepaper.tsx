import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/pdf/PdfViewer"), { ssr: false });

export default function WhitepaperPage() {
  return <PDFViewer file="/whitepaper.pdf" />;
}
