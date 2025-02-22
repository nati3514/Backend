const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createDailyReport = async (req, res) => {
    try {
        const { description, date, magnitude, location, employeeId, status } = req.body;
        
       // console.log('File received:', req.file);

        const attachmentPath = req.file 
            ? `${req.protocol}://${req.get('host')}/${req.file.path}`
            : null;

        const newReport = await prisma.dailyReport.create({
            data: {
                description,
                date: new Date(date),
                magnitude: magnitude.toUpperCase(),
                location,
                attachment: attachmentPath,  
                employeeId,
                status: status.toUpperCase()
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        fullNameEnglish: true,
                        IDNO: true
                    }
                }
            }
        });

        res.status(201).json({
            ...newReport,
            attachmentUrl: attachmentPath 
        });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create report', error: error.message });
    }
};


exports.getAllDailyReports = async (req, res) => {
    try {
        const reports = await prisma.dailyReport.findMany({
            include: {
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        fullNameEnglish: true,
                        IDNO: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(reports);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch reports', error: error.message });
    }
};

exports.getDailyReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma.dailyReport.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        id: true,
                        fullName: true,
                        fullNameEnglish: true,
                        IDNO: true
                    }
                }
            }
        });
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.json(report);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch report', error: error.message });
    }
};


exports.updateDailyReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedReport = await prisma.dailyReport.update({
            where: { id },
            data: { status }
        });

        res.json(updatedReport);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update report status', error: error.message });
    }
};

exports.deleteDailyReport = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.dailyReport.delete({
            where: { id }
        });
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete report', error: error.message });
    }
};
