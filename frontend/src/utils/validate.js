export const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

export const validatePin = (pin) => {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pin);
}

export const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name)
}