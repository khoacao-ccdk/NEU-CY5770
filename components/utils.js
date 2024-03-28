/**
 * Extracts jwt from Authorization header of the request
 * @param {*} req 
 * @returns 
 */
function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
}

function timeStringToSeconds(timeString) {
    if(timeString == null || timeString == "") return null;
    const regex = /^(\d+)([hmsd])$/;
    const match = timeString.match(regex);

    if (!match) {
        throw new Error('Invalid time string format');
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 60 * 60;
        case 'd':
            return value * 24 * 60 * 60;
        default:
            throw new Error('Invalid unit');
    }
}

//Sample return data
const SAMPLE_RETURN_DATA = {
    data1: "Data 1",
    data2: "Data 2",
    data3: "Data 3",
    data4: "Data 4",
};

module.exports = {
    extractToken, 
    timeStringToSeconds,
    SAMPLE_RETURN_DATA
}