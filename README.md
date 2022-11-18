# SWIFT STATUS READ

## This is a nodeJs project. It requires Node to be installed on your machine.

> - Run below command. To install the dependencies.

    ```
        npm install

    ```

> - save the excel sheet with the name below.

    ```
        FDOpenTask.csv
    ```

> - In CSV file, the column names should be as follows

    ```
        order id - ORDEREXTERNALID
        TaskId - TASK_INSTANCE_ID
        swift status - SWIFT STATUS
    ```

> - After placing the "FDOpenTask.csv" in project root.

> - Run below command - 

    ```
        node index.js
    ```

> - It will generate "swift_status_details.csv" file, With these as "ORDEREXTERNALID","TASK_INSTANCE_ID","swiftStatusInSheet","swiftStatusCurrent" fields.