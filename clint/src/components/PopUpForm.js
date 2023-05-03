import {useState,useEffect} from 'react';
import "../styles.css";
import { ethers } from 'ethers';
function PopUpForm({state}) {
    const [showPopup, setShowPopup] = useState(false);
    const [songname, setSongname] = useState('');
    const [murl, setMurl] = useState('');
    const [image, setImage] = useState('');
    const [singer, setSinger] = useState('');
  
    const togglePopup = () => {
      setShowPopup(!showPopup);
    };
  
    const handleSubmit = async(event) => {
      event.preventDefault();
    //   console.log(`Song name: ${songname}`);
    //   console.log(`Music URL: ${murl}`);
    //   console.log(`Image: ${image}`);
    //   console.log(`Singer: ${singer}`);

      // You can send this data to your server or do whatever you need to do with it here.
      // Clear the form fields
      const { contract } = state;
      const value = { value: ethers.utils.parseEther("0.0001") };
  
      const transaction = await contract.add(songname,murl,image,singer,value);
      await transaction.wait();
      console.log("done");
      alert("sucesfully added a song");
      
      setSongname('');
      setMurl('');
      setImage('');
      setSinger('');
      togglePopup();
    };
  
    return (
      <div>
       <button className="add-song-button" onClick={togglePopup}>Add a song</button>
        {showPopup && (
          <div className="popup">
            <form onSubmit={handleSubmit}>
              <label htmlFor="songname">Song Name:</label>
              <input
                type="text"
                id="songname"
                value={songname}
                onChange={(event) => setSongname(event.target.value)}
              />
              <label htmlFor="murl">Music URL:</label>
              <input
                type="text"
                id="murl"
                value={murl}
                onChange={(event) => setMurl(event.target.value)}
              />
              <label htmlFor="image">Image:</label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
              <label htmlFor="singer">Singer:</label>
              <input
                type="text"
                id="singer"
                value={singer}
                onChange={(event) => setSinger(event.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
            <button onClick={togglePopup}>Close Form</button>
          </div>
        )}
      </div>
    );
  }
  export default PopUpForm;
