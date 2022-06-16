export const getErrorMessage = (error, errorMessages) => {
    let message;
    for(const key in errorMessages){
        if (error.includes(key)){
            message = errorMessages[key];
        }
    }
    return message ? message : "Failed to process. Please, try again!";
};
