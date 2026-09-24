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
        channels.forEach(channel => {
          const element = components.createChannelPickerComponent(channel);
          container.appendChild(element);
        });
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

  components.submit().then(result => {
      console.log('Transaction Result:', result);
      alert(`Transaction ${result.status}: ${result.transactionId}`);
  }).catch(error => {
      console.error('Submission error:', error);
      alert('Error submitting transaction');
  });
});
