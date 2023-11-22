export const esTexts = {
  errors: {
    "Email not confirmed": "No se ha confirmado el email",
    "Failed to fetch": "No hay conexión"
  },
};

export const showError = (message) => {
  return esTexts.errors[message] ?? message;
};
