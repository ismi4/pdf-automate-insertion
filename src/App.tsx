import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/",
});

function App() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(`` as any);
  const [fileObject, setFileObject] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    console.log(`op`);
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);

      axiosInstance
        .post(`/upload-pdf`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [file]);

  return (
    <div className="App">
      {!file ? (
        <form>
          <input type="file" onChange={(e) => setFile(e!.target!.files![0])} />
        </form>
      ) : null}

      <button
        onClick={(e) => {
          console.log("mm");
          setPageNumber((num) => ++num);
        }}
      >
        +
      </button>
      <div>
        Page number: <span>{pageNumber}</span>
      </div>
      <button
        onClick={(e) => {
          if (pageNumber >= 1) setPageNumber((num) => --num);
        }}
      >
        -
      </button>

      {file ? (
        <Document file={window.URL.createObjectURL(file)}>
          <Page pageNumber={pageNumber} />
        </Document>
      ) : null}
    </div>
  );
}

export default App;
