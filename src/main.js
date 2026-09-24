import { XenditComponents } from "xendit-components-web";

let components = null;

document.getElementById("load-sdk-button").addEventListener("click", () => {
  const sdkKeyInput = document.getElementById("sdk-key-input").value.trim();
  
  if (!sdkKeyInput) {
    alert("Please enter a valid components_sdk_key");
    return;
  }

  try {
    // Initialize the SDK with the key from the input
    components = new XenditComponents({ 
      componentsSdkKey: sdkKeyInput 
    });

    const container = document.getElementById("payment-container");
    container.innerHTML = "<p>Loading payment methods...</p>";

    // Listen for the 'init' event before getting channels
    components.addEventListener("init", () => {
      container.innerHTML = ""; // Clear loading message

      const channels = components.getActiveChannels();

      if (channels && channels.length > 0) {
        // Just create one unified picker
        const element = components.createChannelPickerComponent();
        container.appendChild(element);
        document.getElementById("payment-section").style.display = "block";
      } else {
        container.innerHTML = "<p>No active payment channels available.</p>";
        document.getElementById("payment-section").style.display = "block";
      }
    });

    // Listen for fatal errors (e.g. Origin not authorized)
    components.addEventListener("fatal-error", (error) => {
      console.error("Fatal Error from SDK:", error);
      // Wait, is it `error.message` or `error.detail.message`? For CustomEvents it might be `error.detail.message`. Let's just output both to be safe or `error.message || error`
      const errMsg = error.message || (error.detail && error.detail.message) || String(error);
      container.innerHTML = `<p style="color: red;"><strong>SDK Error:</strong> ${errMsg}</p>`;
      document.getElementById("payment-section").style.display = "block";
    });

  } catch (error) {
    console.error("SDK Initialization Error:", error);
    alert("Failed to initialize SDK.");
  }
});

// Submit transaction on button click
document.getElementById("pay-button").addEventListener("click", () => {
  if (!components) {
    alert("SDK not initialized yet!");
    return;
  }

  // Set up success listener if not already done
  if (!window.sessionCompleteAttached) {
    components.addEventListener("session-complete", (event) => {
      console.log('Transaction Result:', event);
      alert('Transaction Successful!');
      window.location.href = '/success.html';
    });
    window.sessionCompleteAttached = true;
  }

  try {
    components.submit();
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting transaction');
  }
});
