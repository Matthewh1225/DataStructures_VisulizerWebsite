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
        className="youtube-button"
      >
        <img src={youtubelogo} alt="Youtube Logo" className="youtube-logo" />
      </button>
      {open && (
        <div className="youtube-modal">
          <button className="youtube-close-btn" onClick={() => setOpen(false)}>X</button>
          <iframe
            src="https://web.archive.org/web/20100101000000/https://www.youtube.com/"
            className="youtube-iframe"
          />
        </div>
      )}
    </div>
  );
}