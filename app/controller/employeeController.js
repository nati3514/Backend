const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                IDNO: true,
                fullName: true,
                fullNameEnglish: true,
                status: true
            },
            where: {
                status: 'Active'
            }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};
