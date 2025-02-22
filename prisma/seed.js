const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const timestamp = Date.now();
    
    // Create Branch with unique IDNO
    const branch = await prisma.branch.create({
        data: {
            IDNO: `BR${timestamp}`,
            name: "Main Branch",
            city: "Sample City",
            subCity: "Sample SubCity",
            wereda: "01"
        }
    });

    // Create Department with unique IDNO
    const department = await prisma.department.create({
        data: {
            IDNO: `DEP${timestamp}`,
            name: "Engineering Department",
            branchId: branch.id
        }
    });

    // Create Position with unique IDNO
    const position = await prisma.position.create({
        data: {
            IDNO: `POS${timestamp}`,
            name: "Senior Engineer Position",
            departmentId: department.id
        }
    });

    // Create Employee with unique IDNO and names
    const employee = await prisma.employee.create({
        data: {
            IDNO: `EMP${timestamp}`,
            rank: "Senior Engineer",
            docNo: {
                passport: "P123456",
                license: "L789012"
            },
            fullNameEnglish: `John Smith ${timestamp}`,
            fullName: `John William Smith ${timestamp}`,
            dateOfBirth: new Date("1990-05-15"),
            nationality: "American",
            sex: "Male",
            workDetail: {
                create: {
                    employementType: "FULL_TIME",
                    shift: {
                        morning: "8:00 AM",
                        evening: "5:00 PM"
                    },
                    salary: "75000",
                    startDate: new Date("2020-01-15"),
                    agreement: "standard-agreement.pdf",
                    positionId: position.id,
                    systemUser: {
                        create: {
                            IDNO: `USR${timestamp}`,
                            userName: `john.smith${timestamp}`,
                            email: `john.smith${timestamp}@example.com`,
                            password: "hashedpassword123",
                            status: "Active"
                        }
                    }
                }
            }
        }
    });

    // Create sample daily reports
    const reports = await prisma.dailyReport.createMany({
        data: [
            {
                description: "First Test Report",
                date: new Date(),
                magnitude: "HIGH",
                location: "Main Office",
                employeeId: employee.id,
                status: "PENDING"
            },
            {
                description: "Second Test Report",
                date: new Date(),
                magnitude: "LOW",
                location: "Branch Office",
                employeeId: employee.id,
                status: "PENDING"
            }
        ]
    });

    console.log({ branch, department, position, employee, reports });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
