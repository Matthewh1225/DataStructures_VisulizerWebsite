import './KeyDetailsPanel.css';
import NavBar from '../NavBar/NavBar';
export default function KeyDetailsPanel() {
  return (
    <>
      <NavBar />
      <div>
      <input type="text" placeholder="Search Key Details..." className="KeyDetailsSearchBar"/>
      
      </div>
      <div className="key-details-panel">
        <div>
          <button className='SearchButton'>Search</button>
        </div>
        <div>
        </div>
        <p className='KeyDetailsTitle'>This panel will display key details about the selected data structure or algorithm.</p>

      </div>
    </>
  );
}
