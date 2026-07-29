// rules.js
export const rules = {
  required: (fieldName = 'field') => (value) => {
    return !!value || `You must enter a ${fieldName}.`;
  },
  email: (value) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid e-mail.';
  },
  phone: (value) =>{
    const pattern = /^(09|\+959)(4|2|5|7|8|9|6)([0-9]{7,9})$/;
    return pattern.test(value) || 'Invalid phone number';
  },
  min: (len) => (value) => {
    return (value && value.length >= len) || `Must be at least ${len} characters.`;
  },
  // Latitude validation (between -90 and 90)
  latitude: (v) => {
    const pattern = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,15})?$/;
    return pattern.test(v) || "Invalid Latitude number (eg. 16.123456)";
  },
  // Longitude validation (between -180 and 180)
  longitude: (v) => {
    const pattern = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,15})?$/;
    return pattern.test(v) || "Invalid Longitude number (eg. 96.123456)";
  },
  
  // ဂဏန်းသန့်သန့်ပဲ ဖြစ်ရမည်
  numberOnly: (v) => !isNaN(parseFloat(v)) && isFinite(v) || "This field is only supported for numbers",
};