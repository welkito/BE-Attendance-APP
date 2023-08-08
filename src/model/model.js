import db from "./index.js";

export const User = db.sequelize.define("user", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    password : {
        type : db.Sequelize.STRING,
        allowNull : false,
        defaultValue : ""
    },
    fullname : {
        type : db.Sequelize.STRING,
        allowNull : false,
        defaultValue : ""
    },
    dob : {
        type : db.Sequelize.DATE,
        allowNull : false,
        defaultValue : new Date()
    },
    roleId : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 2
    },
    shiftId : {
        type : db.Sequelize.INTEGER,
        allowNull : true,
        defaultValue : 1
    },
},{
  timestamps: false
});

export const Attendance = db.sequelize.define("attendance", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    attendance_userId: {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    clockIn : {
        type : db.Sequelize.DATE,
        allowNull : true
    },
    clockOut : {
        type : db.Sequelize.DATE,
        allowNull : true,
    },
    clockInDeduction : {
        type : db.Sequelize.INTEGER,
        allowNull : true,
        defaultValue : 20000
    },
    clockOutDeduction : {
        type : db.Sequelize.INTEGER,
        allowNull : true,
        defaultValue : 20000
    },
},{
  timestamps: false
});

export const Payroll = db.sequelize.define("payroll", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    payroll_userId: {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    month : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    salary : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
    },
    deduction : {
        type : db.Sequelize.INTEGER,
        allowNull : true,
        // defaultValue : 1
    },
    total : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : 1
    },
},{
  timestamps: false
});

export const Role = db.sequelize.define("role", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name : {
        type : db.Sequelize.STRING,
        allowNull : false
    }
},{
  timestamps: false
});

export const Shift = db.sequelize.define("shift", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    start : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    end : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
},{
  timestamps: false
});

export const Salary = db.sequelize.define("salary", {
    id : {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    salary_userId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    salary : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    }
},{
  timestamps: false
});