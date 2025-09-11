export const sendOTP = async (email) => {
  if (!email) {
    console.error("sendOTP called without email");
    return { success: false };
  }

  try {
    
    const response = await fetch("http://192.168.36.67:8000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("📦 Response from /send-otp:", data);

    if (!response.ok || !data.otp) {
      throw new Error(data.message || "OTP not received");
    }

    return { success: true, otp: data.otp }; 
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false };
  }
};

