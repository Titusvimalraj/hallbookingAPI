let checkValueIfEmpty = (args) => {
    console.log('checkValueIfEmpty is getting run');
    console.log(args);
    return [...args].every((el) => el !== null && el !== undefined && el !== "");
}

let validateDate = ({ startDate, endDate }) => {
    console.log('date is getting validated');
    return new Date(startDate) < new Date(endDate);
}

let checkAllParams = (bodyParams, action = '') => {
    console.log('checkAllParams is getting run');
    let paramsList;
    if (action === 'add') {
        paramsList = ["roomName", "bookedStatus", "date", "amnesties", "pricePerHour", "numberOfSeats"];
    } else {
        paramsList = ["customerName", "startDate", "endDate"];
    }
    return Object.entries(bodyParams).every((el => paramsList.includes(el[0])));
}

module.exports = {
    checkValueIfEmpty: checkValueIfEmpty,
    validateDate: validateDate,
    checkAllParams: checkAllParams
}