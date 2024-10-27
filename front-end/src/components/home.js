import React, { useState } from 'react';

export const Home = () => {
  const [siteName, setWebsiteName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(false); // Success state

  const createWeb = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setLoading(true); // Start loading and disable button

    try {
      // Prepare the form data with siteName
      const formData = {
        siteName,
      };

      // First, check if the server is ready for a new request (with siteName)
      const readyResponse = await fetch("http://localhost:3000/ready", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send siteName in the body
      });

      if (readyResponse.ok) {
        console.log('Server is ready. Proceeding with website creation...');

        const creationFormData = {
          siteName,
          prompt,
        };

        const response = await fetch("http://b-wp.zelobrix.com/generate-js", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(creationFormData),
        });

        if (response.ok) {
          console.log('Website creation request sent. Waiting for completion...');

          // Poll the server for completion status with siteName
          const checkStatus = async () => {
            try {
              const statusResponse = await fetch('http://b-wp.zelobrix.com/ready', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Pass siteName to check readiness
              });
              if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                if (statusData.ready) {
                  setSuccess(true); // Success state
                  setLoading(false); // Stop loading
                  console.log('Website created successfully:', statusData);
                } else {
                  // If not ready, retry after a delay
                  setTimeout(checkStatus, 2000);
                }
              }
            } catch (error) {
              console.error('Error checking status:', error);
              setLoading(false);
            }
          };

          checkStatus(); // Start polling
        } else {
          console.error('Failed to send creation request');
          setLoading(false); // Stop loading in case of failure
        }
      } else {
        console.error('Server is not ready for a new request');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Stop loading in case of error
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}><a href='/'>Home</a></li>
          <li style={styles.navItem}><a href='/web'>Create Website</a></li>
          <li style={styles.navItem}><a href='/support'>Support</a></li>
        </ul>
      </nav>
      <div style={styles.formContainer}>
        <form onSubmit={createWeb}>
          <label style={styles.label}>
            Website Name:
            <input
              type='text'
              id='siteName'
              value={siteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              style={styles.input}
              disabled={loading} // Disable input while loading
            />
          </label>
          <br />
          <label style={styles.label}>
            Website Idea:
            <textarea
              type='text'
              id='prompt'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={styles.input}
              disabled={loading} // Disable input while loading
            />
          </label>
          <br />
          <button type='submit' style={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
        {loading && <p style={styles.status}>Please wait, the website is being created...</p>}
        {success && <p style={styles.success}>Website created successfully!</p>}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  nav: {
    marginBottom: '20px',
    backgroundColor: '#f8f8f8',
    padding: '10px',
    borderRadius: '5px',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  },
  navItem: {
    margin: '0 10px',
  },
  formContainer: {
    backgroundColor: '#f1f1f1',
    padding: '20px',
    borderRadius: '5px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '10px',
    color: '#FFA500', // Orange color for status
  },
  success: {
    marginTop: '10px',
    color: '#4CAF50', // Green color for success message
  },
};

export default Home;
