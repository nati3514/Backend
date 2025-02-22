const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();


exports.GetInfo = async (req, res) => {
  try {
    const info = await prisma.businessInfo.findMany ();
    return res.status (200).json ({info:info[0]});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateInfo = async (req, res) => {
  const {name, phone,email,VAT,TIN,license,profile} = req.body;
  try {
    if(!name || !phone || !email || !VAT || !TIN || !license || !profile){
      return res.status(400).json({message: 'Please fill all fields'});
    }
    const findInfo=await prisma.businessInfo.findMany()
    if (findInfo.length >0) {
      await prisma.businessInfo.updateMany ({
        data: {
          name, phone,email,VAT,TIN,license,profile
        },
      });
    return res.status (200).json ({message: 'Business Info Updated'});
  }  
    await prisma.businessInfo.create ({
      data: {
        name, phone,email,VAT,TIN,license,profile
      },
    });

    return res.status (200).json ({message: 'Business Info Created'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
