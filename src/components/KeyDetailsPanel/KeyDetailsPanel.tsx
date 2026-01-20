import './KeyDetailsPanel.css';
import NavBar from '../NavBar/NavBar';
import { BiCarousel } from 'react-icons/bi';
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
          <BiCarousel className='KeyDetailsIcon'/>
        </div>
        <p className='KeyDetailsTitle'>This panel will display key details about the selected data structure or algorithm.</p>

      </div>
    </>
  );
}
