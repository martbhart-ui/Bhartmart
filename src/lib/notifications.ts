// Background Automatic Notification Services

export const sendAutoSMS = async (phone: string, message: string) => {
  try {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const apiKey = import.meta.env.VITE_FAST2SMS_KEY;

    if (!apiKey || cleanPhone.length !== 10) {
      console.warn('SMS skipped: Invalid phone or API key missing.');
      return;
    }

    await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: message,
        language: 'english',
        numbers: cleanPhone,
      }),
    });
    console.log('Auto SMS triggered successfully to', cleanPhone);
  } catch (err) {
    console.error('Fast2SMS auto delivery failed:', err);
  }
};