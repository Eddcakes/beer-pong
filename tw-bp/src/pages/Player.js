import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Player({ updatePageTitle }) {
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);

  //set page title
  useEffect(() => {
    //probably fill this in with name / or doesnt exist after loaded player details
    updatePageTitle(`Player: ${playerId}`);
  }, [updatePageTitle, playerId]);

  //load details
  useEffect(() => {
    // player id passed through
    /*     if (playerId !== undefined) {
      setLoading(true);
      fetch(`http://localhost:1337/api/v1/players/${playerId}`);
    } */
  });

  return (
    <div>
      Player page
      <div>
        <label>
          Player id? <input />
        </label>
      </div>
    </div>
  );
}
