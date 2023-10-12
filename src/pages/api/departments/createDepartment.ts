import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   name: 'Nombre del departamento',
//   description: 'Descripción del departamento'
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { name, description } = req.body;

    // - Validando que no se haya registrado el mismo correo o contraseña
    const validateName = await Department.findOne({ name: name });

    if (validateName) {
      return res.status(400).json({
        message: 'El nombre del departamento ya se encuentra registrado',
      });
    }

    const department = new Department({
      name: name,
      description: description,
    });

    await department.save();

    res.status(200).json({ message: 'Departamento creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
