export const validateIndianPhone = (phone: string) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const generateAdminID = () => {
  return 'ADM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

