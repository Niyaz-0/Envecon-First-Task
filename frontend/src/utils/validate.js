export const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

export const validatePin = (pin) => {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pin);
}