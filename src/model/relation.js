import { User,Attendance,Payroll,Role,Salary,Shift } from "./model.js"

User.hasMany(Attendance,{sourceKey : "id", foreignKey : "attendance_userId"})
Attendance.belongsTo(User, {targetKey : "id", foreignKey : "attendance_userId"})//, { foreignKey : "idCategory" }
//1 prod bs punya banyak prod_cat
User.hasMany(Payroll,{sourceKey : "id", foreignKey : "payroll_userId"})
Payroll.belongsTo(User, {targetKey : "id", foreignKey : "payroll_userId"})//, { foreignKey : "idUser" }

Role.hasMany(User,{sourceKey : "id", foreignKey : "roleId"})
User.belongsTo(Role, {targetKey : "id", foreignKey : "roleId"})

Shift.hasOne(User,{sourceKey : "id", foreignKey : "shiftId"})
User.belongsTo(Shift, {targetKey : "id", foreignKey : "shiftId"})

User.hasOne(Salary,{sourceKey : "id", foreignKey : "salary_userId"})
Salary.belongsTo(User, {targetKey : "id", foreignKey : "salary_userId"})

export {User,Salary,Shift,Attendance,Payroll,Role}