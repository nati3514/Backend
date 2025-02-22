const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

// Create a new report
exports.createReport = async (req, res) => {
    try {
        // Destructure the expected fields from the request body
        const { userId, date, shiftTime, location, report, description, reportMeasurement, status } = req.body;
        console.log(userId,date,report)
        // Convert userId to an integer
        //const userIdInt = parseInt(userId, 10);

        // // Validate userId
        // if (isNaN(userIdInt)) {
        //     return res.status(400).json({ error: 'Invalid User ID.' });
        // }

        // Define your attachments with default path
        const attachments = ['default-path'];

        const newReport = await prisma.dailyReport.create({
            data: {
                userId: userId, // Use the integer userId
                date: date,
                shiftTime,
                location,
                report,
                description, // Add description
                reportMeasurement, // Add report measurement
                status: status || 'Pending',
                attachments: attachments.join(','), // Store as a comma-separated string
            },
        });

        // Respond with the newly created report
        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: error.message });
    }
};


// All other routes remain unchanged (getReports, getReportById)

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await prisma.dailyReport.findMany();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a report by ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma.dailyReport.findUnique({
            where: { id: parseInt(id) },
        });

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update a report by ID
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, shiftTime, location, report, description, reportMeasurement, status } = req.body;

        const updatedReport = await prisma.dailyReport.update({
            where: { id: parseInt(id) },
            data: {
                date: new Date(date),
                shiftTime,
                location,
                report,
                description,
                reportMeasurement,
                status,
            },
        });

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.Analytics = async (req, res) => {
    try {
        const measurementStats = await prisma.dailyReport.groupBy({
            by: ['reportMeasurement'],
            _count: {
                reportMeasurement: true,
            },
        });

        // Aggregate by location
        const locationStats = await prisma.dailyReport.groupBy({
            by: ['location'],
            _count: {
                location: true,
            },
        });

        // Aggregate by shift time
        const shiftStats = await prisma.dailyReport.findMany({
            select: {
                shiftTime: true,
            },
        });

        // Aggregate by date
        const dateStats = await prisma.dailyReport.groupBy({
            by: ['date'],
            _count: {
                date: true,
            },
        });

        res.json({
            measurementStats,
            locationStats,
            shiftStats,
            dateStats,
        });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: error.message });
    }
};
