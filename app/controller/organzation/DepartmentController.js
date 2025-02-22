const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcryptjs');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.department.findFirst ({
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  if (!lastDoc) return prefixname;
  // Extract code and number
  const code = lastDoc.IDNO.split ('-')[0];
  let number = lastDoc.IDNO.split ('-')[1];

  // Increment number
  number = parseInt (number) + 1;

  // Pad with zeros
  number = number.toString ().padStart (5, '0');

  // Return new id
  return code + '-' + number;
}

exports.AllDepartment = async (req, res) => {
  try {
    const rawDepartments = await prisma.department.findMany({
      include: {
        branch: { select: { name: true } },
        positions: {
          include: { EmployeeWorkDetail: true },
        },
      },
    });

    const departments = rawDepartments.map((dep) => {
      // Calculate the total employee count by summing up EmployeeWorkDetail lengths across positions
      const employeeCount = dep.positions.reduce(
        (count, position) => count + position.EmployeeWorkDetail.length,
        0
      );

      return {
        id: dep.id,
        IDNO: dep.IDNO,
        name: dep.name,
        status: dep.status,
        createdAt: dep.createdAt,
        updatedAt: dep.updatedAt,
        branch: dep.branch.name,
        employees:employeeCount,  // Include the calculated employee count
      };
    });

    return res.status(200).json({ departments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.GetDepartment = async (req, res) => {
  try {
      const { id } = req.params;
      const department = await prisma.department.findUnique({
          where: { IDNO: id },
          include: {
              branch: true
          }
      });

      if (!department) {
          return res.status(404).json({ message: 'Department not found' });
      }

      return res.status(200).json(department);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.UpdateDepartment = async (req, res) => {
  try {
      const { id } = req.params;
      const { name, branch, status } = req.body;

      const existingDepartment = await prisma.department.findUnique({
          where: { IDNO: id }
      });

      if (!existingDepartment) {
          return res.status(404).json({ message: 'Department not found' });
      }

      
      if (name !== existingDepartment.name) {
          const nameExists = await prisma.department.findFirst({
              where: {
                  name: { contains: name },
                  branchId: branch,
                  IDNO: { not: id }
              }
          });

          if (nameExists) {
              return res.status(400).json({ message: 'Department name already exists in this branch' });
          }
      }

      const updatedDepartment = await prisma.department.update({
          where: { IDNO: id },
          data: {
              name,
              status,
              branchId: branch
          }
      });

      return res.status(200).json({
          message: 'Department updated successfully',
          data: updatedDepartment
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.FindDepartment = async (req, res) => {
  const {branchId} = req.query;
  try {
    const departments = await prisma.department.findMany ({
      where: {branchId: branchId},
    });
    return res.status (200).json ({departments});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.CloseDepartment = async (req, res) => {
  const {id} = req.query;
  try {
    const departments = await prisma.department.update ({
      where: {id: id},data:{status:'InActive'}
    });
    return res.status (200).json ({message:'Closed Department'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewDepartment = async (req, res) => {
  const {name, branch} = req.body;

  try {
    const IDNO = await GenerateIdNo ('DPHR-00001');
    const FindDepName=await prisma.department.findFirst({where:{name:{contains:name},branchId:branch}})
    if (FindDepName) {
    return res.status (401).json ({message: 'Department Name Exist'});
    }
    await prisma.department.create ({
      data: {
        IDNO: IDNO,
        name,
        branch: {
          connect: {id: branch},
        },
      },
    });

    return res.status (200).json ({message: 'Branch Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
