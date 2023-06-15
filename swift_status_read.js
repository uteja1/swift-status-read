const axios = require('axios');
let fs = require('fs');
let csvToJson = require('convert-csv-to-json');
let json2csv = require('json2csv').parse;
let { globalAgent } = require('https');
globalAgent.options.rejectUnauthorized = false

/**
 *
 * @public
 * @function invokeWoreMateAdvancedSearch
 * @name invokeWoreMateAdvancedSearch
 * @param {object} swiftObj
 * @returns {object} response
 */
async function invokeWoreMateAdvancedSearch(swiftObj) {
    console.log(`Started with invokeWoreMateAdvancedSearch`);
    try {
        swiftObj.fdTaskData = await axios.post('https://workmate-svc-prod.kubeodc-prod.corp.intranet:443/RestService/Enterprise/v4/Work/task/advancedSearch', {
            searchFields: [
                {
                    fieldName: 'isSystemTask',
                    value: ['Yes'],
                    operator: 'IN',
                    tableName: 'task_type_sys_param',
                    isDateCriteria: false
                },
                {
                    fieldName: 'TASK_INSTANCE_ID',
                    value: [swiftObj.TASK_INSTANCE_ID],
                    operator: 'contains',
                    tableName: 'task_instance',
                    isDateCriteria: false
                }
            ]
        }, {
            params: {
                include: 'p,aa',
            },
            headers: {
                'X-Username': 'AC96723'
            },
            validateStatus: false,
            responseType: 'json'
        });
        console.log(swiftObj.fdTaskData.data.taskResults[0].TASK_STATUS);
        console.log(`Ended with invokeWoreMateAdvancedSearch`);
    } catch (error) {
        console.log(`Error from invokeWoreMateAdvancedSearch occurred due to: ${error}`);
    }
}

/**
 *
 * @public
 * @function invokeWoreSwiftOrderPackage
 * @name invokeWoreSwiftOrderPackage
 * @param {object} swiftObj
 * @returns {object} response
 */
async function invokeWoreSwiftOrderPackage(swiftObj) {
    console.log(`Started with invokeWoreSwiftOrderPackage`);
    try {
        swiftObj.swiftData = await axios.get(`http://swiftservices:9000/v1/OrderPackage/LoadOrderPackageDetail?searchModel.transactionId=${swiftObj.fdTaskData.data.taskResults[0].ORDER_ID}`);
        console.log(swiftObj.swiftData.data.Status);
        console.log(`Ended with invokeWoreSwiftOrderPackage`);
    } catch (error) {
        console.log(`Error from invokeWoreSwiftOrderPackage occurred due to: ${error}`);
    }
}

/**
 *
 * @public
 * @function appendOrCreateCsvFile
 * @name appendOrCreateCsvFile
 * @param {object} swiftObj
 * @returns {object} response
 */
async function appendOrCreateCsvFile(swiftObj) {
    console.log(`Started with appendOrCreateCsvFile`);
    try {
        //prepare data to append 
        let appendThis = [{
            "ORDER_ID": swiftObj.fdTaskData.data?.taskResults ? swiftObj.fdTaskData.data.taskResults[0].ORDER_ID : 'n/a',
            "TASK_INSTANCE_ID": swiftObj.TASK_INSTANCE_ID,
            "TASK_STATUS_IN_FD": swiftObj.fdTaskData.data?.taskResults ? swiftObj.fdTaskData.data.taskResults[0].TASK_STATUS : swiftObj.TASK_STATUS,
            "TASK_STATUS_IN_SWIFT": swiftObj.swiftData?.data ? swiftObj.swiftData.data.Status : 'n/a',
        }];
        // logic for creating csv file and append data to it
        const filename = "swift_status_details.csv";
        let rows;
        // If file doesn't exist, we will create new file and add rows with headers.    
        if (!fs.existsSync(filename)) {
            rows = json2csv(appendThis, { header: true });
        } else {
            // Rows without headers.
            rows = json2csv(appendThis, { header: false });
        }
        // Append file function can create new file too.
        fs.appendFileSync(filename, rows);
        // Always add new line if file already exists.
        fs.appendFileSync(filename, "\r\n");
        console.log(`Ended with appendOrCreateCsvFile`);
    } catch (error) {
        console.log(`Error from appendOrCreateCsvFile occurred due to: ${error}`);
    }
}

/**
 *
 * @public
 * @function buildCsvFile
 * @name buildCsvFile
 * @param {object} swiftObj
 * @returns {object} response
 */
async function buildCsvFileSwiftData() {
    console.log(`Started with buildCsvFileSwiftData`);
    //converting csv to json
    let swiftArrayObj = csvToJson.fieldDelimiter(',').getJsonFromCsv("FDOpenTask.csv");
    try {
        for( swiftObj of swiftArrayObj) {
            await invokeWoreMateAdvancedSearch(swiftObj);
            await invokeWoreSwiftOrderPackage(swiftObj);
            await appendOrCreateCsvFile(swiftObj);
        }
        console.log(`Ended with buildCsvFileSwiftData`);
    } catch (error) {
        console.log(`Error from buildCsvFileSwiftData occurred due to: ${error}`);
    }
}


buildCsvFileSwiftData();