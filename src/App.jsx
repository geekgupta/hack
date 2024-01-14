import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import 'firebase/database';
import copy from 'clipboard-copy';

const App = () => {
  const [copiedText, setCopiedText] = useState('');
  const [messages, setMessages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAYhUL6IldwLa_k3LFhZr2L530oQKMYEUI",
      authDomain: "interview-d7bdf.firebaseapp.com",
      databaseURL: "https://interview-d7bdf-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "interview-d7bdf",
      storageBucket: "interview-d7bdf.appspot.com",
      messagingSenderId: "276816537356",
      appId: "1:276816537356:web:b7706fe4786b1a9bcf4b29",
      measurementId: "G-P0HG4X7XLL"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbRef = ref(db, 'copied_text');

    onValue(dbRef, (snapshot) => {
      const text = snapshot.val();
      setCopiedText(text);

      // Add the new message to the list of messages only if it's not already in the list
      setMessages((prevMessages) =>
        prevMessages.includes(text) ? prevMessages : [text, ...prevMessages]
      );

      // Reset the copiedIndex to null to remove the button color change
      setCopiedIndex(null);
    });
  }, []); // Empty dependency array to run the effect only once

  const handleCopyClick = (text, index) => {
    // Implement the logic to copy the text to the clipboard
    copy(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
        // Update the state to store the index of the copied message
        setCopiedIndex(index);
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error);
        // Optionally, you can handle the error or add a notification
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Copied Text</h1>
        <p className="mb-4">{copiedText}</p>

        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <ul className="list-none p-0 w-full max-w-md">
          {messages.map((message, index) => (
            <li
              key={index}
              className="border-b border-gray-300 py-2 flex justify-between items-center"
            >
              <span className="flex-1">{message}</span>
              <button
                className={`${
                  copiedIndex === index ? 'bg-green-500' : 'bg-blue-500'
                } text-white py-1 px-2 rounded`}
                onClick={() => handleCopyClick(message, index)}
              >
                {copiedIndex === index ? 'Copied' : 'Copy'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
