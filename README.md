# SWIFT STATUS READ

## This is a nodeJs project. It requires Node to be installed on your machine.

> - Run below command. To install the dependencies.

    ```
        npm install

    ```

> - save the excel sheet in CSV format and with below name.

    ```
        FDOpenTask.csv
    ```

> - In CSV file, the column names should be as follows

    ```
        TASK_INSTANCE_ID (source task id)
        TASK_STATUS (task status in FD)
    ```

> - After placing the "FDOpenTask.csv" in project root.

> - Delete "swift_status_details.csv"  older file, Before starting it.

> - Run below command - 

    ```
        node swift_status_read.js
    ```

> - It will generate "swift_status_details.csv" file. With these as "ORDER_ID","TASK_INSTANCE_ID",      "TASK_STATUS_IN_FD","TASK_STATUS_IN_SWIFT", fields.

> - After running the command and generating CSV output file.To, start again with new data. Please, delete "swift_status_details.csv" and run command again.