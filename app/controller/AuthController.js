const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
require ('dotenv').config ();
const config = require ('../config/index');

const prisma = new PrismaClient ();
const secretKey = config.JWTSECRET;
const expiresIn = config.EXPIREDIN;


exports.Login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await prisma.systemUser.findFirst ({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status (404).json ({message: 'Invaild Email'});
    }
    const isValidPassword = await bcrypt.compare (password, user.password);
    if (!isValidPassword) {
      return res.status (401).json ({message: 'Invaild Password'});
    }
    const token = jwt.sign ({userId: user.id}, secretKey, {
      expiresIn: expiresIn,
    });

    await prisma.systemUser.updateMany ({where: {email}, data: {token: token}});

    return res.status (200).json ({message: 'Wellcome User', token});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.Forget = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await prisma.user.findUnique ({where: {email}});
    if (!user) {
      return res.status (404).json ({message: 'Email Not Found'});
    }

    const password = '1234567';
    const hashPassword = await bcrypt.hash (password, 10);

    await prisma.user.update ({where: {email:email}, data: {password:hashPassword, token:''}});

    return res.status (200).json ({message: 'Password Was Sent'});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.IsAuth = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await prisma.systemUser.findUnique({where:{id:userId}});
    return res.status (200).json ({user});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
