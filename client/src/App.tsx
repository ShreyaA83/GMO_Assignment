import { useState, useEffect, useRef } from 'react';
import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import axios from 'axios';
import dropdownIcon from './assets/dropdown_icon.svg';
import logo from './assets/logo.png';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords,setTotalRecords] = useState(0);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage,setCurrentPage] = useState(1); 
  const [rowCount, setRowCount] = useState<number | null>(null); 
  const overlayPanelRef = useRef<OverlayPanel>(null); 

  const fetchArtworks = async (page: number = 1) => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}?page=${page}`;
      const response = await axios.get(apiUrl);
      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };  
  

  useEffect(() => {
    const savedSelections = JSON.parse(localStorage.getItem('selectedArtworks') || '[]');
    setSelectedArtworks(savedSelections);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('selectedArtworks', JSON.stringify(selectedArtworks));
  }, [selectedArtworks]);
  
  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage]); 
  

  const handleRowSelection = () => {
    if (rowCount && rowCount > 0) {
      const rowsToSelect = artworks.slice(0, rowCount); 
      setSelectedArtworks(rowsToSelect);
    }
    overlayPanelRef.current?.hide(); 
  };

  const headerCheckbox = (event: React.MouseEvent) => {
    overlayPanelRef.current?.toggle(event); 
    event.preventDefault();
  };
  useEffect(() => {
    console.log("Fetching artworks for page:", setCurrentPage);
    fetchArtworks(currentPage);
  }, [currentPage]);
  

  
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
           <Button tooltip="Click" tooltipOptions={{ showDelay: 1, hideDelay: 300 }}
            style={{ background: 'transparent', border: 'none', padding: 0,  }}
           className="hover-button "
           >
         
          <a href="https://www.growmeorganic.com/" target='_blank'> <img src={logo} alt="Logo" style={{ width: '50px', height: '50px' }} /></a>
        </Button>
      </div>

      <DataTable
        value={artworks}
        paginator rows={5} rowsPerPageOptions={[5, 10, 15]} tableStyle={{ minWidth: '30rem' }}
        selectionMode="multiple"
        selection={selectedArtworks}
        selectionPageOnly
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
        loading={loading}
        totalRecords={totalRecords}
        
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em' }}
        ></Column>
        <Column 
          header={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                onClick={headerCheckbox} 
                raised 
                style={{ background: 'transparent', border: 'none', color: 'inherit' }} 
              >
                <img src={dropdownIcon} alt="Dropdown Icon" style={{ width: '10px', height: '10px' }} />
              </Button>
            </div>
          }
        ></Column>
        <Column field="title" header="Title" body={(rowData) => rowData.title || 'N/A'}></Column>
        <Column field="place_of_origin" header="Place of Origin" body={(rowData) => rowData.place_of_origin || 'N/A'}></Column>
        <Column field="artist_display" header="Artist" body={(rowData) => rowData.artist_display || 'N/A'}></Column>
        <Column field="inscriptions" header="Inscriptions" body={(rowData) => rowData.inscriptions || 'N/A'}></Column>
        <Column field="date_start" header="Date Start" body={(rowData) => rowData.date_start || 'N/A'}></Column>
        <Column field="date_end" header="Date End" body={(rowData) => rowData.date_end || 'N/A'}></Column>
      </DataTable>

      <OverlayPanel ref={overlayPanelRef} style={{ width: '350px' }}>
        <div className="p-inputgroup flex">
          <InputNumber
            value={rowCount}
            onValueChange={(e) => setRowCount(e.value as number)} 
            placeholder="Enter row count"
            min={1} 
            max={artworks.length} 
          />
          <Button label="Select" onClick={handleRowSelection} />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default App;
