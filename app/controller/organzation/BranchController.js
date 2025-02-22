const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.branch.findFirst ({
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

exports.AllBranch = async (req, res) => {
  try {
    const branchData = await prisma.branch.findMany({
      include: {
        Department: {
          include: {
            positions: {
              include: {
                EmployeeWorkDetail: true,
              },
            },
          },
        },
      },
    });

    const formattedBranchData = branchData.map((branch) => {
      const employeeCount = branch.Department.reduce((count, department) => {
        return (
          count +
          department.positions.reduce(
            (positionCount, position) => positionCount + position.EmployeeWorkDetail.length,
            0
          )
        );
      }, 0);

      return {
        id: branch.id,
        status: branch.status,
        createdAt: branch.createdAt,
        name: branch.name,
        IDNO: branch.IDNO,
        city: branch.city,
        subCity: branch.subCity,
        wereda: branch.wereda,
        employees:employeeCount,
      };
    });

    return res.status(200).json({branchs:formattedBranchData});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};



exports.NewBranch = async (req, res) => {
  const {name, city, subCity, wereda} = req.body;

  try {
    const IDNO = await GenerateIdNo ('BRHR-00001');
    const FindBranchName=await prisma.branch.findFirst({where:{name:{contains:name}}})
    if (FindBranchName) {
    return res.status (401).json ({message: 'Branch Name Exist'});
    }  
    await prisma.branch.create ({
      data: {
        IDNO: IDNO,
        name,
        city,
        subCity,
        wereda,
      },
    });

    return res.status (200).json ({message: 'Branch Created'});
  } catch (error) {
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.GetBranchById = async (req, res) => {
  try {
      const { id } = req.params;
      const branch = await prisma.branch.findUnique({
          where: { IDNO: id }
      });

      if (!branch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      return res.status(200).json(branch);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.UpdateBranch = async (req, res) => {
  try {
      const { id } = req.params;
      const { name, city, subCity, wereda, status } = req.body;

      const existingBranch = await prisma.branch.findUnique({
          where: { IDNO: id }
      });

      if (!existingBranch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      const updatedBranch = await prisma.branch.update({
          where: { IDNO: id },
          data: {
              name,
              city,
              subCity,
              wereda,
              status: status === 'Active' ? 'Active' : 'InActive'
          }
      });

      return res.status(200).json({
          message: 'Branch updated successfully',
          data: updatedBranch
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
  }
};


