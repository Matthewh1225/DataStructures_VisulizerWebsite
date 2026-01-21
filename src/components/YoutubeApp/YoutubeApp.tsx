import youtubelogo from '../../assets/youtubelogo.png';
import'./YoutubeApp.css';

// export default function YoutubeApp(){
//     return(
//         <div>
//             <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
//             <img src={youtubelogo} alt="Youtube-Logo " className="youtube-logo"  />
//             </a>
//         </div>
//     );

//   }
  import React, { useState } from 'react';

export default function YoutubeAppWindow() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          boxShadow: 'none',
          cursor: 'pointer',
        }}
      >
        <img src={youtubelogo} alt="Youtube Logo" className="youtube-logo" />
      </button>
      {open && (
        <div style={{
            position: 'fixed',
            top: '10%',
            left: '10%',
            width: '80vw',
            height: '80vh',
            border: '2px solid #888',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 0 20px #000',
            background: 'transparent',
        }}>
          <button style={{ float: 'right', margin: 8 }} onClick={() => setOpen(false)}>X</button>
          <iframe
            src="https://web.archive.org/web/20090101000000/https://www.youtube.com/"
            style={{ width: '100%', height: '95%', border: 'none' }}
          />
        </div>
      )}
    </div>
  );
}