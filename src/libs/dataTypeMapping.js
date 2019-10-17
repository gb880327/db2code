export const typeMapping = {
    mysqlTojava: {
        int: "Integer",
        bigint: "Long",
        smallint: "Integer",
        mediumint: "Integer",
        varchar: "String",
        char: "String",
        tinytext: "String",
        text: "String",
        mediumtext: "String",
        longtext: "String",
        datetime: "Date",
        date: "Date",
        time: "Date",
        timestamp: "Long",
        tinyint: "Boolean",
        decimal: "Double",
        float: "Double",
        double: "Double"
    }
};
export const dataTypeList = {
    database: {
        mysql: [
            "int",
            "bigint",
            "smallint",
            "mediumint",
            "varchar",
            "char",
            "tinytext",
            "text",
            "mediumtext",
            "longtext",
            "datetime",
            "date",
            "time",
            "timestamp",
            "tinyint",
            "decimal",
            "float",
            "double"
        ]
    },
    codeLang: {
        java: ["Integer", "Long", "String", "Date", "Boolean", "Double"]
    }
};