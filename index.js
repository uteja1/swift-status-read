const axios = require('axios');
let fs = require('fs');
let csvToJson = require('convert-csv-to-json');
let json2csv = require('json2csv').parse;

//converting csv to json
let swiftArrayObj = csvToJson.fieldDelimiter(',').getJsonFromCsv("FDOpenTask.csv");

swiftArrayObj.forEach(swiftObj => {

    axios.get(`http://swiftservices:9000/v1/OrderPackage/LoadOrderPackageDetail?searchModel.transactionId=${swiftObj.ORDEREXTERNALID}`)
        .then(response => {
            console.log(response.data.Status);
            //prepare data to append 
            let appendThis = [{
                "ORDEREXTERNALID": swiftObj.ORDEREXTERNALID,
                "TASK_INSTANCE_ID": swiftObj.TASK_INSTANCE_ID,
                "swiftStatusInSheet": swiftObj.SWIFTSTATUS,
                "swiftStatusCurrent": response.data.Status,
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
        })
        .catch(error => {
            console.log(error);
        });
});

