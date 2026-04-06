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
    const pattern = /^(09|\+959)(4|2|5|7|8|9)([0-9]{7,9})$/;
    return pattern.test(value) || 'Invalid phone number';
  },
  min: (len) => (value) => {
    return (value && value.length >= len) || `Must be at least ${len} characters.`;
  }
};